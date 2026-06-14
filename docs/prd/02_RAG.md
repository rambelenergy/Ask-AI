# PRD-02: RAG + Cron Automated Ingestion

**Feature ID:** F02
**Version:** 1.0
**Date:** 2026-06-14
**Status:** Draft — awaiting review
**Estimated Effort:** ~16.5 days
**Depends On:** Supabase pgvector extension (enable before starting)
**Index:** ← [Back to PRD Index](./00_INDEX.md)

---


## 2. RAG (Retrieval-Augmented Generation)

### 2.1 Problem Statement

Current ask-energy AI searches the web (Brave/LangSearch) for every query. It cannot answer questions from platform-curated content (articles, publications, uploaded documents). The site publishes high-quality energy analysis that should be the primary source for AI answers.

RAG will allow the AI to retrieve information from indexed platform content + uploaded reference documents, with source citations.

### 2.2 Goals

- Index all published articles and publications as searchable vectors
- Allow admin to upload reference documents (PDF, DOCX, TXT) for indexing
- Store document chunks as embeddings in Supabase with pgvector
- Build a retrieval API that returns top-k relevant chunks for any query
- Generate embeddings using OpenAI `text-embedding-3-small` (1536 dimensions)
- Track sources and provide citation metadata

### 2.3 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| RG-01 | Admin | Upload energy reports (PDF, DOCX) to the knowledge base | The AI can use them as reference material |
| RG-02 | Admin | View indexed documents and their chunk counts | I know what's in the knowledge base |
| RG-03 | Admin | Re-index or remove documents | The knowledge base stays current |
| RG-04 | Visitor | Ask questions that retrieve platform articles | I get answers grounded in published analysis |
| RG-05 | Developer | Get top-k relevant chunks via API | RAG can be integrated into ask-energy |

### 2.4 Technical Architecture

```
  ┌──────────────┐      ┌─────────────────┐
  │ Cron Scheduler│      │  Admin Upload    │
  │ (Vercel Cron) │      │  (PDF/DOCX/TXT) │
  └──────┬───────┘      └────────┬────────┘
         │                       │
  ┌──────▼────────┐             │
  │ Trusted Source │             │
  │ Poller         │             │
  │ (RSS, API,     │             │
  │  HTML scrape)  │             │
  └──────┬────────┘             │
         │                       │
  ┌──────▼────────┐             │
  │ Dedup + Diff   │             │
  │ (content hash) │             │
  └──────┬────────┘             │
         │                       │
         └───────────┬───────────┘
                     │
            ┌────────▼────────┐
            │  Text Extraction │
            │  + Chunking      │
            │  (500 tokens,    │
            │   50 overlap)    │
            └────────┬────────┘
                     │
            ┌────────▼────────┐
            │  OpenAI Embed    │
            │  text-embedding- │
            │  3-small (1536d) │
            └────────┬────────┘
                     │
            ┌────────▼────────┐
            │  pgvector Store  │
            │  (Supabase)      │
            └─────────────────┘

                    ┌─────────────────┐
                    │  User Query      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Embed Query     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Vector Search   │
                    │  (cosine dist,   │
                    │   top-k=10)      │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Rerank + Filter │
                    │  (priority,      │
                    │   deduplication) │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  Context Assembly│
                    │  + Source Cites  │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │  LLM Generation  │
                    └─────────────────┘
```

### 2.5 Database Schema

#### Migration: Enable pgvector

```sql
-- Run in Supabase SQL Editor
CREATE EXTENSION IF NOT EXISTS vector;
```

#### New Tables

```sql
-- Documents table: tracks uploaded/managed documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  source_type TEXT NOT NULL CHECK (source_type IN ('article', 'publication', 'uploaded_pdf', 'uploaded_docx', 'uploaded_txt', 'external_report')),
  source_id UUID,                 -- FK to articles.id or publications.id if from CMS
  file_url TEXT,                  -- Storage URL if uploaded
  file_type TEXT,                 -- mime type
  file_size_bytes BIGINT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'indexed', 'failed')),
  error_message TEXT,
  chunk_count INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}',   -- author, date, language, tags
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Document chunks: individual indexed segments
CREATE TABLE document_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content TEXT NOT NULL,
  embedding vector(1536),
  token_count INTEGER,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Vector similarity search index
CREATE INDEX idx_chunks_embedding ON document_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Unique: one chunk index per document
CREATE UNIQUE INDEX idx_chunks_doc_chunk ON document_chunks (document_id, chunk_index);
```

#### RLS Policies

```sql
-- Public: can read indexed document metadata + chunks (for search)
CREATE POLICY "Public read documents" ON documents FOR SELECT USING (status = 'indexed');
CREATE POLICY "Public read chunks" ON document_chunks FOR SELECT USING (true);

-- Admin: full CRUD
CREATE POLICY "Admin full access documents" ON documents FOR ALL
  USING (auth.role() = 'authenticated');
CREATE POLICY "Admin full access chunks" ON document_chunks FOR ALL
  USING (auth.role() = 'authenticated');
```

### 2.6 API Endpoints

#### Document Ingestion

**`POST /api/admin/documents/upload`** (Admin only)
```
FormData: { file: File, title: string, source_type: string }
→ Triggers async ingestion pipeline
→ Returns { documentId, status: "pending" }
```

**`GET /api/admin/documents`** (Admin only)
```
→ Returns list of all documents with status, chunk_count, dates
```

**`POST /api/admin/documents/[id]/reindex`** (Admin only)
```
→ Re-processes document (delete old chunks, re-embed)
```

**`DELETE /api/admin/documents/[id]`** (Admin only)

#### RAG Retrieval

**`POST /api/rag/search`**
```typescript
// Request
{ "query": "Algeria solar export strategy 2030" }

// Response
{
  "chunks": [
    {
      "id": "uuid",
      "content": "Algeria aims to export 10 GW of solar...",
      "document": { "title": "Algeria Energy Strategy 2025", "source_type": "article" },
      "score": 0.92,
      "metadata": { "page": 3, "section": "Solar Exports" }
    }
    // ... top-10 chunks
  ],
  "query": "Algeria solar export strategy 2030"
}
```

### 2.7 Ingestion Pipeline

```
1. Upload → Store file in Supabase Storage
2. Extract text (PDF: pdf-parse, DOCX: mammoth, TXT: direct, HTML: cheerio)
3. Chunk text:
   - Target: 500 tokens per chunk
   - Overlap: 50 tokens
   - Split on: paragraph boundaries, then sentence boundaries
4. Generate embedding per chunk (OpenAI text-embedding-3-small)
5. Store in document_chunks with metadata
6. Update documents.status = 'indexed'
```

**Edge cases handled:**
- Files > 10MB: reject with clear message
- Empty extracted text: mark as failed, show error
- Duplicate documents: detect via content hash, warn admin
- Embedding API rate limits: batch with exponential backoff
- Failed chunks: retry 3x, mark document as 'failed' if all fail

### 2.8 Automated Trusted Source Ingestion (Cron)

#### 2.8.1 Problem

RAG is only as good as the data it indexes. Manually uploaded documents get stale. The platform needs a background mechanism to automatically fetch, process, and index new content from trusted energy sources on a schedule — keeping the knowledge base current without admin intervention.

#### 2.8.2 Architecture

```
Vercel Cron Job (every 6h)
    │
    ▼
┌──────────────────────────────────────────┐
│  GET /api/cron/ingest-trusted-sources     │
│  (Authorization: Bearer <CRON_SECRET>)    │
└──────────────┬───────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────┐
│  For each enabled TrustedSourceFeed:     │
│                                           │
│  1. Check if feed is due (schedule)       │
│  2. Fetch source (RSS → parse,           │
│     API → JSON, HTML → scrape)           │
│  3. Extract new items since last run      │
│  4. For each NEW item:                   │
│     a. Fetch full content (readability)   │
│     b. SHA-256 content hash              │
│     c. Skip if hash exists (dedup)       │
│     d. Chunk → embed → store             │
│  5. Log run: items found/new/skipped,    │
│     errors, duration                     │
└──────────────────────────────────────────┘
```

#### 2.8.3 Trusted Source Feed Configuration

**Table: `trusted_source_feeds`**

```sql
CREATE TABLE trusted_source_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                          -- "EIA Today in Energy"
  feed_type TEXT NOT NULL CHECK (feed_type IN ('rss', 'atom', 'json_api', 'html_page')),
  url TEXT NOT NULL,                           -- Feed/API endpoint URL
  source_group TEXT NOT NULL CHECK (source_group IN (
    'government', 'international_org', 'news', 'research', 'platform'
  )),
  priority INTEGER DEFAULT 5,                 -- 1 (highest) – 10 (lowest)
  language TEXT DEFAULT 'en',
  schedule TEXT NOT NULL DEFAULT '0 */6 * * *', -- per-feed cron (checked on each tick)
  enabled BOOLEAN DEFAULT true,
  -- Source-specific config
  item_selector TEXT,                          -- CSS selector for HTML scrape
  content_selector TEXT,                       -- CSS selector for full article body
  max_items_per_run INTEGER DEFAULT 10,
  -- Tracking
  last_run_at TIMESTAMPTZ,
  last_success_at TIMESTAMPTZ,
  last_item_pubdate TIMESTAMPTZ,              -- PubDate of most recent fetched item
  last_error TEXT,
  items_fetched_total INTEGER DEFAULT 0,
  items_indexed_total INTEGER DEFAULT 0,
  consecutive_failures INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Table: `crawl_logs`**

```sql
CREATE TABLE crawl_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_id UUID REFERENCES trusted_source_feeds(id) ON DELETE SET NULL,
  run_type TEXT NOT NULL CHECK (run_type IN ('scheduled', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'failed')),
  items_found INTEGER DEFAULT 0,
  items_new INTEGER DEFAULT 0,
  items_skipped INTEGER DEFAULT 0,
  items_failed INTEGER DEFAULT 0,
  documents_indexed INTEGER DEFAULT 0,
  error_message TEXT,
  duration_ms INTEGER,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_crawl_logs_feed ON crawl_logs (feed_id);
CREATE INDEX idx_crawl_logs_started ON crawl_logs (started_at DESC);
```

#### 2.8.4 Initial Trusted Source Feeds

| # | Source | Type | URL | Schedule | Priority |
|---|--------|------|-----|----------|----------|
| 1 | EIA Today in Energy | RSS | `https://www.eia.gov/rss/todayinenergy.xml` | every 6h | 1 |
| 2 | IEA Newsroom | RSS | `https://www.iea.org/rss/news` | every 12h | 1 |
| 3 | IRENA Publications | RSS | `https://www.irena.org/rss` | every 24h | 2 |
| 4 | MEM Algeria (وزارة الطاقة) | HTML | `https://www.energy.gov.dz/?rubrique=actualites` | every 24h | 1 |
| 5 | Sonatrach Actualités | HTML | `https://sonatrach.dz/actualites/` | every 24h | 2 |
| 6 | European Commission Energy | RSS | `https://energy.ec.europa.eu/rss/news_en.xml` | every 12h | 2 |
| 7 | ENTSO-E News | RSS | `https://www.entsoe.eu/news/rss/` | every 24h | 3 |
| 8 | Med-TSO News | HTML | `https://www.med-tso.com/news/` | every 24h | 3 |
| 9 | Reuters Energy | RSS | `https://www.reuters.com/arc/outboundfeeds/v3/all/?outputType=xml&section=energy` | every 6h | 4 |
| 10 | S&P Global Commodity Insights | RSS | `https://www.spglobal.com/commodityinsights/en/rss` | every 12h | 4 |

#### 2.8.5 Cron Implementation

**`vercel.json`**

```json
{
  "crons": [
    {
      "path": "/api/cron/ingest-trusted-sources",
      "schedule": "0 */6 * * *"
    },
    {
      "path": "/api/cron/cleanup-stale-documents",
      "schedule": "0 3 * * 0"
    }
  ]
}
```

**`src/app/api/cron/ingest-trusted-sources/route.ts`** — Core handler:

```typescript
export async function GET(request: Request) {
  // 1. Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Fetch all enabled feeds
  const feeds = await getEnabledFeeds();

  // 3. Filter to feeds due based on their individual schedule + last_success_at
  const dueFeeds = feeds.filter(isFeedDue);

  // 4. Process each feed sequentially (respect rate limits)
  const results = [];
  for (const feed of dueFeeds) {
    try {
      const result = await processFeed(feed);
      results.push({ feed: feed.name, status: "ok", ...result });
    } catch (err) {
      results.push({ feed: feed.name, status: "error", error: String(err) });
      // Increment consecutive_failures; auto-pause at 5
      await handleFeedFailure(feed, err);
    }
  }

  return Response.json({ run: new Date().toISOString(), feeds_checked: dueFeeds.length, results });
}
```

**Per-feed schedule check** — allows individual feed schedules without separate cron jobs:

```typescript
function isFeedDue(feed: TrustedSourceFeed): boolean {
  if (!feed.enabled) return false;
  if (feed.consecutive_failures >= 5) return false; // Auto-paused
  if (!feed.last_success_at) return true; // Never run
  const elapsedMs = Date.now() - new Date(feed.last_success_at).getTime();
  const intervalMs = parseCronInterval(feed.schedule); // e.g., "0 */6 * * *" → 6h
  return elapsedMs >= intervalMs;
}
```

#### 2.8.6 Content Processing Per Feed Item

```
1. FETCH item URL
   ├── Timeout: 10s per page
   ├── User-Agent: RamBelEnergy/2.0 (info@rambelenergy.com)
   └── Respect robots.txt (optional, best-effort)

2. EXTRACT readable content
   ├── RSS/Atom: <description> + fetch full article via <link>
   ├── JSON API: map to title + content per source config
   └── HTML: cheerio with content_selector (fallback: @mozilla/readability auto-detect)

3. VALIDATE
   ├── Content length > 200 chars (skip if too short)
   ├── SHA-256 hash of extracted content
   └── Check hash against documents.metadata->>'content_hash' → skip if duplicate

4. CHUNK + EMBED (same pipeline as Section 2.7)
   ├── source_type = 'external_auto'
   └── metadata: { content_hash, source_url, pub_date, feed_id, source_group }

5. LOG
   ├── Update feed: last_success_at, items_fetched_total, items_indexed_total
   └── Insert crawl_log record
```

#### 2.8.7 Admin UI — Trusted Feeds

Add under **/admin/knowledge-base/feeds**:

| Column | Description |
|--------|-------------|
| Name | Feed name + source group badge (🏛️ Gov / 🌐 IEA / 📰 News) |
| Type | RSS / API / HTML pill badge |
| Schedule | Human-readable ("Every 6 hours") |
| Status | 🟢 Active / 🔴 Error / ⏸️ Paused / ⚪ Never Run |
| Last Run | Timestamp + relative ("2h ago") |
| Items | Total indexed from this feed |
| Actions | Run Now, Pause/Resume, Edit, View Logs |

**Feed detail page** (`/admin/knowledge-base/feeds/[id]`):
- Edit feed config (URL, schedule, selectors, max_items)
- Recent crawl logs (last 20 runs with status, counts, duration, errors)
- Indexed documents from this feed (latest 50)
- "Run Now" manual trigger button

**Crawl logs page** (`/admin/knowledge-base/logs`):
- Cross-feed run history with filters (feed, status, date range)
- Summary stats: total indexed, success rate, avg duration

#### 2.8.8 Edge Cases & Safeguards

| Concern | Mitigation |
|---------|------------|
| Source returns garbage/spam | Min content length (200 chars); extract readability score; flag for review |
| Feed changes structure | `consecutive_failures` counter; auto-pause at 5 failures + notify admin |
| Rate limiting by source | Sequential processing; 2s delay between items |
| Duplicate content across feeds | Content hash dedup works across **all** feeds + manual uploads |
| Embedding cost runaway | `max_items_per_run` per feed; global daily cap via `EMBEDDING_DAILY_MAX_TOKENS` env var |
| Vercel Cron timeout (60s free / 300s pro) | Process max 3 feeds per tick; stagger heavy feeds across hours |
| Stale content accumulation | Weekly `cleanup-stale-documents` cron: remove news chunks >90d old (keep gov/reports) |
| Source blocks our scraper | Respect 429 + Retry-After; exponential backoff; pause feed |

### 2.9 Admin UI (Manual Upload)

Add to existing admin sidebar: **"Knowledge Base"** section with sub-items:

- **Documents** (`/admin/documents`): table with title, type, source (manual vs auto), status badge, chunk count, dates, actions (reindex, delete)
- **Upload** (`/admin/documents/upload`): drag-and-drop file upload, title input, source type selector
- **Trusted Feeds** (`/admin/knowledge-base/feeds`): manage automated ingestion sources
- **Crawl Logs** (`/admin/knowledge-base/logs`): run history across all feeds

### 2.10 Acceptance Criteria

- [ ] pgvector extension enabled on Supabase
- [ ] `documents` + `document_chunks` tables created with indexes
- [ ] `trusted_source_feeds` + `crawl_logs` tables created
- [ ] Admin can upload PDF, DOCX, TXT files
- [ ] Uploaded files are chunked and embedded automatically
- [ ] Existing articles/publications are indexable (one-click from CMS)
- [ ] Cron job fetches from ≥10 configured trusted sources on schedule
- [ ] Content hash dedup prevents duplicate indexing across feeds + uploads
- [ ] Auto-pause after 5 consecutive failures per feed (with admin notification)
- [ ] Crawl logs viewable in admin with full run stats
- [ ] Admin can add/edit/pause/resume trusted source feeds
- [ ] `POST /api/rag/search` returns top-10 relevant chunks with scores
- [ ] Vector search uses cosine distance, <200ms with ivfflat index
- [ ] Admin document list shows `source_type` (manual vs auto) + source feed origin
- [ ] Failed ingestion shows error message in admin UI
- [ ] Embedding costs are tracked; daily token cap enforced
- [ ] Stale news content auto-cleaned after 90 days

### 2.11 Scope & Estimates

| Task | Estimate | Depends On |
|------|----------|------------|
| pgvector setup + migration | 0.5 day | Supabase access |
| `documents` + `document_chunks` schema + types | 0.5 day | Migration |
| `trusted_source_feeds` + `crawl_logs` schema | 0.5 day | Migration |
| `POST /api/admin/documents/upload` + manual ingestion pipeline | 2 days | Schema |
| Text extraction (PDF, DOCX, TXT, HTML) | 1 day | Upload API |
| Chunking logic (500 tokens, 50 overlap) | 1 day | Text extraction |
| Embedding generation + storage | 1 day | Chunking |
| `POST /api/rag/search` retrieval endpoint | 1 day | Embeddings |
| Cron: `GET /api/cron/ingest-trusted-sources` handler | 1.5 days | Schema, Pipeline |
| Cron: per-feed poller (RSS parse, HTML scrape, API fetch) | 1.5 days | Cron handler |
| Cron: dedup + content hash + batch processing | 0.5 day | Poller |
| Cron: `cleanup-stale-documents` weekly job | 0.5 day | — |
| Admin: documents list/upload UI | 1.5 days | APIs |
| Admin: trusted feeds list/detail/edit UI | 1.5 days | Cron APIs |
| Admin: crawl logs page with filters | 0.5 day | Cron APIs |
| Index existing CMS articles + publications | 1 day | Pipeline |
| Seed 10 trusted source feeds | 0.5 day | Feed schema |
| **Total** | **~16.5 days** | | |

---

