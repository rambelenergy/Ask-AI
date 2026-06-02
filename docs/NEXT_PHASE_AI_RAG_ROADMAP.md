# Next Phase AI/RAG Roadmap — RamBelEnergy.com

**Date:** 2026-05-29
**Status:** Phase 1 Complete — Phase 2 Planning Document

---

## Phase 1 AI Summary (Current State)

### What Phase 1 AI Does
- **Context-based Q&A**: Visitors provide text/article content, ask questions, receive answers grounded only in that content
- **Article Summarization**: One-click AI summaries of individual articles
- **Secure backend**: All AI requests go through server-side API routes
- **Professional tone**: Energy-analysis focused responses
- **Clear limitations**: UI explicitly states answers are based on supplied content only

### What Phase 1 AI Does NOT Do
- Search a knowledge base of documents
- Retrieve information from stored articles automatically
- Cite sources or provide references
- Process multilingual queries automatically
- Index or embed documents
- Use vector search or RAG workflow

---

## Phase 2 Vision: Trusted Knowledge Base AI

### Goal
Enable AI answers backed by a larger trusted knowledge base built from curated sources, not just user-supplied context.

---

## Phase 2 Technical Architecture

```
User Query
    ↓
[Query Understanding]
    ↓
[Vector Search] ← Embeddings ← [Document Store]
    ↓
[Relevant Chunks Retrieved]
    ↓
[Context Assembly]
    ↓
[LLM with Citations]
    ↓
[Answer with Source References]
```

---

## Phase 2 Feature Roadmap

### 1. Document Ingestion Pipeline
**Objective**: Automatically process and store content for AI retrieval

**Sources to Ingest**:
- Published platform articles (from CMS)
- Government energy reports and white papers
- News articles (curated, trusted sources)
- Research publications and academic papers
- Reference materials and policy documents

**Technical Components**:
- Text extraction (PDF, DOCX, HTML)
- Content chunking with overlap
- Metadata extraction (title, date, source, author)
- Quality filtering and deduplication

**Estimated Scope**: 2-3 weeks

---

### 2. Vector Database & Embeddings
**Objective**: Store document chunks as searchable vectors

**Technology**:
- **pgvector** extension for PostgreSQL (via Supabase)
- **Embedding model**: `text-embedding-3-small` or similar via OpenRouter
- **Vector dimension**: 1536 (OpenAI) or model-specific

**Schema Addition**:
```sql
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id),
  content TEXT NOT NULL,
  embedding vector(1536),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX ON document_chunks USING ivfflat (embedding vector_cosine_ops);
```

**Estimated Scope**: 1-2 weeks

---

### 3. RAG Query Workflow
**Objective**: Answer user questions using retrieved document chunks

**Flow**:
1. User asks: "What does Algeria's energy policy say about solar exports?"
2. System embeds the query
3. Vector search finds top-5 most relevant chunks
4. System assembles context from retrieved chunks
5. LLM generates answer with citations
6. UI displays: answer + source references

**New API Endpoint**:
- `POST /api/ai/search`
- Request: `{ question: string }`
- Response: `{ answer: string, sources: Source[] }`

**Source Citation Format**:
```
According to [Source: Algeria Energy Strategy 2025], Algeria aims to...
```

**Estimated Scope**: 2-3 weeks

---

### 4. Homepage AI Upgrade
**Objective**: Replace context-based assistant with knowledge-base search

**Changes**:
- Remove context textarea (no longer needed)
- Single question input: "Ask about Algeria-Europe energy..."
- AI automatically searches knowledge base
- Results include source citations
- "Based on X sources" indicator

**UI Update**:
- Search-focused interface
- Source cards below answer
- "Was this helpful?" feedback
- Related questions suggestions

**Estimated Scope**: 1-2 weeks

---

### 5. Multilingual AI Support
**Objective**: Support Arabic, English, Italian, Spanish, and French

**Approach**:
- Detect user language from query
- Use multilingual embedding model
- Translate queries to English for retrieval
- Translate answers back to user language
- OR: Use multilingual LLM that handles all languages

**Languages Priority**:
1. English (primary)
2. French (Algeria-Europe relevance)
3. Arabic (Algerian audience)
4. Italian (Italian energy partnerships)
5. Spanish (Spanish energy partnerships)

**Estimated Scope**: 2-3 weeks

---

### 6. Document Management Admin
**Objective**: Admin interface for managing AI knowledge base

**Features**:
- Upload documents (PDF, DOCX, TXT)
- View indexed documents
- Re-index / delete documents
- Monitor ingestion status
- View search analytics

**Estimated Scope**: 2 weeks

---

### 7. Source Credibility Scoring
**Objective**: Rank sources by trustworthiness

**Factors**:
- Government sources: highest credibility
- Established news outlets: high credibility
- Academic journals: high credibility
- Platform articles: medium credibility
- Unverified sources: flagged

**UI Impact**:
- Credibility badge on sources
- Filter by source type
- "Trusted sources only" option

**Estimated Scope**: 1-2 weeks

---

## Phase 2 Timeline Estimate

| Feature | Duration | Cumulative |
|---------|----------|------------|
| Document Ingestion Pipeline | 2-3 weeks | Week 3 |
| Vector Database & Embeddings | 1-2 weeks | Week 5 |
| RAG Query Workflow | 2-3 weeks | Week 8 |
| Homepage AI Upgrade | 1-2 weeks | Week 10 |
| Multilingual Support | 2-3 weeks | Week 13 |
| Document Management Admin | 2 weeks | Week 15 |
| Source Credibility Scoring | 1-2 weeks | Week 17 |

**Total Estimated Duration**: 12-17 weeks (3-4 months)

**Recommendation**: Phase 2 can be broken into smaller releases:
- **Phase 2a**: Document ingestion + vector search + RAG (Weeks 1-8)
- **Phase 2b**: Multilingual + admin + credibility (Weeks 9-17)

---

## Phase 2 Cost Considerations

### Infrastructure
- **Supabase**: May need larger database plan for vector storage
- **Vercel**: Pro plan recommended for production traffic
- **OpenRouter**: Token usage will increase significantly with RAG
  - Current: ~1000 tokens per request
  - RAG: ~3000-5000 tokens per request (retrieval + generation)

### Estimated Monthly Costs (Production)
| Service | Phase 1 | Phase 2 |
|---------|---------|---------|
| Supabase (Pro) | $25 | $25-50 |
| Vercel (Pro) | $20 | $20 |
| OpenRouter | $10-30 | $50-200 |
| **Total** | **~$55-75** | **~$95-270** |

*(Varies based on traffic and usage)*

---

## Phase 2 Exclusions (Future Phases)

### Phase 3 — Advanced Analytics
- User behavior analytics
- Content performance metrics
- AI answer quality tracking
- Predictive energy trend analysis

### Phase 4 — Platform Expansion
- Subscription/membership system
- Premium content access
- Interactive energy data visualizations
- Mobile application
- Real-time energy price feeds

### Phase 5 — Ecosystem
- API for third-party integrations
- White-label solutions
- Multi-tenant architecture
- Enterprise partnerships

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| Vector storage costs grow | Medium | Optimize chunk sizes, prune old data |
| Embedding API rate limits | Medium | Implement caching, batch processing |
| Document ingestion errors | High | Robust error handling, retry logic |
| RAG answer quality | High | Fine-tune retrieval, human feedback loop |
| Multilingual accuracy | Medium | Test with native speakers, iterate |

---

## Success Criteria for Phase 2

- [ ] AI can answer questions using stored knowledge base
- [ ] Answers include source citations
- [ ] Homepage AI works without manual context paste
- [ ] Admin can upload and manage documents
- [ ] Multilingual support works for 3+ languages
- [ ] Answer accuracy > 80% on test questions
- [ ] Average response time < 5 seconds
- [ ] No API key exposure in frontend

---

## Conclusion

Phase 1 established a credible, professional foundation with basic AI capabilities.

Phase 2 will transform the AI from a "context-only assistant" into a true "knowledge base search" that can draw from a curated collection of energy intelligence materials.

The technical foundation laid in Phase 1 (Next.js, Supabase, OpenRouter, component architecture) is designed to support this expansion without major rewrites.

**Recommended next action**: Review and approve Phase 2 scope and budget before proceeding.

---

**Document prepared by:** OpenClaw Development Agent
**Date:** 2026-05-29
