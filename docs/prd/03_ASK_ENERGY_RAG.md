# PRD-03: Ask-Energy Optimization with RAG

**Feature ID:** F03
**Version:** 1.0
**Date:** 2026-06-14
**Status:** Draft — awaiting review
**Estimated Effort:** ~4.5 days
**Depends On:** F02 (RAG) — retrieval API must be operational
**Index:** ← [Back to PRD Index](./00_INDEX.md)

---


## 3. Ask-Energy Optimization with RAG

### 3.1 Problem Statement

The current ask-energy pipeline searches the web (Brave/LangSearch) for every query. While effective for current events, it cannot leverage platform-curated content. Also, the web-only search means:

- Answers may miss deep analysis already published on the platform
- No ability to answer from uploaded reference documents
- Citations only link to external sources, not internal content

A hybrid approach — web search + RAG retrieval — provides the best of both worlds: live web data for current events, and deep platform knowledge for authoritative analysis.

### 3.2 Goals

- Run RAG retrieval **in parallel** with web search for every ask-energy query
- Merge + deduplicate web results and RAG chunks
- Send combined context to OpenAI for answer generation
- Cite internal documents alongside external sources
- Respect existing priority weighting (P1-P6) — internal content gets high priority
- Maintain existing SSE streaming UX
- Ensure no latency regression (parallel execution, not sequential)

### 3.3 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| AE-01 | Visitor | Ask questions that retrieve platform articles | Answers draw from published analysis |
| AE-02 | Visitor | See which answers came from internal vs external sources | I can assess authority |
| AE-03 | Admin | Platform content surfaces in user queries | Published articles get more visibility |
| AE-04 | Analyst | Get answers backed by uploaded reports | Reference documents inform the AI |

### 3.4 Technical Design

#### Updated Ask-Energy Flow

```
User Question
    │
    ├──────────────────────┬──────────────────────┐
    ▼                      ▼                      ▼
┌──────────┐      ┌──────────────┐       ┌──────────────┐
│ Language │      │  RAG Search  │       │  Web Search  │
│ Detect   │      │  /api/rag/   │       │  Brave +     │
│          │      │  search      │       │  LangSearch   │
└──────────┘      └──────┬───────┘       └──────┬───────┘
    │                    │                      │
    │                    ▼                      ▼
    │           ┌───────────────────────────────────┐
    │           │  Merge + Deduplicate + Rerank     │
    │           │  - RAG chunks → highest priority   │
    │           │  - P1-P6 web sources → existing    │
    │           │  - Deduplicate by content overlap  │
    │           │  - Max 15 combined results         │
    │           └───────────────┬───────────────────┘
    │                           │
    ▼                           ▼
┌──────────────────────────────────────────────────┐
│  Build Prompt (system + user)                     │
│  - Include RAG chunks as "Platform Knowledge"    │
│  - Include web results as "Web Sources"          │
│  - Live price data (if applicable)               │
│  - Language-aware instructions                   │
└──────────────────────┬───────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────┐
│  OpenAI SSE Streaming (gpt-4o-mini)              │
│  → Answer with citations to internal + external   │
└──────────────────────────────────────────────────┘
```

#### Key Changes to `ask-energy/route.ts`

```typescript
// NEW: Parallel execution (no latency impact)
const [searchResult, ragResult] = await Promise.all([
  searchTrustedSources(question, language),   // existing
  fetchRagChunks(question),                     // NEW
]);

// NEW: Merge with priority
const combinedContext = mergeAndRerank(
  searchResult.results,   // web results (P1-P6)
  ragResult.chunks,       // RAG chunks (P0 = highest)
  { maxResults: 15 }
);

// MODIFIED: Prompt includes RAG context
const { system, user } = buildAskEnergyPrompt(
  question,
  combinedContext,
  language,
  livePriceData
);

// MODIFIED: Sources include internal documents
const sources = combinedContext.map(buildSourceCitation);
```

#### Source Citation UI Update

```
🔍 Answer:
Algeria aims to export 10 GW of renewable energy to Europe by 2030,
primarily through the SoutH2 Corridor and ELMED interconnection projects.

📚 Sources:
  🏛️ [Platform] Algeria Energy Strategy 2025 — Published Analysis
  🌐 [P1 Gov] mem-algeria.org — Algeria-Spain Interconnection
  🌐 [P2 Official] sonatrach.dz — SoutH2 Corridor Timeline
  🌐 [P5 News] reuters.com — Algeria Solar Tender 2026
```

#### Priority in Merged Results

| Priority | Source Type | Weight |
|----------|-------------|--------|
| **P0 (new)** | RAG chunks from platform documents | 1.40x |
| P1 | Government TLDs (.gov, .gov.dz, etc.) | 1.30x |
| P2 | Algerian Official (sonatrach.dz, etc.) | 1.25x |
| P3 | European institutions | 1.20x |
| P4 | International organizations (IEA, IRENA, etc.) | 1.15x |
| P5 | News (Reuters, Bloomberg, etc.) | 1.00x |
| P6 | Other (.com, .org) | 0.90x |

#### Fallback Behavior

- RAG is **optional enhancement**, not a requirement
- If RAG returns no results → proceed with web-only (current behavior)
- If RAG API fails → log error, proceed with web-only
- If web search fails AND RAG has results → proceed with RAG-only
- If both fail → return error message

### 3.5 Acceptance Criteria

- [ ] RAG retrieval runs in parallel with web search (no added latency)
- [ ] Merged results are deduplicated (no same content from two sources)
- [ ] Platform content appears as P0 priority in search results
- [ ] Source citations distinguish internal (🏛️ Platform) from external (🌐 Web)
- [ ] Ask-Energy API works without RAG if RAG is unavailable (graceful degradation)
- [ ] Existing question categorization + priority reranking still works
- [ ] Max 15 combined results sent to LLM (maintains token budget)
- [ ] Chat UI shows platform sources with document title link
- [ ] Mobile: source badges don't overflow horizontally
- [ ] Benchmark accuracy does not degrade from current scores

### 3.6 Scope & Estimates

| Task | Estimate | Depends On |
|------|----------|------------|
| `fetchRagChunks()` utility | 1 day | Feature 2 (RAG) |
| `mergeAndRerank()` with P0 priority | 0.5 day | RAG utility |
| Update `build-answer-prompt.ts` for RAG context | 0.5 day | Merge logic |
| Update `ask-energy/route.ts` parallel flow | 0.5 day | All above |
| Source citation UI updates (AskEnergyChat) | 1 day | API changes |
| Fallback + error handling | 0.5 day | — |
| Accuracy benchmark re-run | 0.5 day | Integration complete |
| **Total** | **~4.5 days** | Must have Feature 2 |

---

