# Phase 1 Updated Requirements — RamBelEnergy.com

**Date:** 2026-05-29
**Status:** Overrides original 2026-05-25 requirements where conflicts exist

---

## 1. Original Phase 1 Scope (Baseline)

From the signed 2026-05-25 documents:

- Professional public website (Homepage, About, Analysis, Article Detail, Research)
- Lightweight CMS with Supabase Auth
- Basic AI summarization (admin/prototype only)
- Simple AI assistant prototype
- "Ask about Algeria-Europe Energy" as **future preview/roadmap only**
- Responsive design
- Vercel + Supabase deployment

---

## 2. Updated Requirements (2026-05-29)

These requirements **override** the original scope where they conflict.

### 2.1 Homepage AI Assistant — Now Functional (Was: Future Preview)

**Requirement ID:** UPD-AI-01
**Priority:** Must

The AI assistant must be visible directly on the homepage as one of the platform's main interactive features. It must no longer appear only as a "coming soon" or roadmap preview.

**Homepage Section Title:** "Ask About Algeria-Europe Energy"

**Required Elements:**
- Visibly integrated into homepage experience
- Matches institutional visual tone
- Context/article text input OR controlled selected-content mechanism
- Visitor question input
- Clear submit action
- Loading, success, empty, and error states
- Generated AI answer displayed in readable result panel
- Responsive on desktop and mobile

**Acceptance Criteria:**
- [ ] Section is prominently placed on homepage (not hidden/buried)
- [ ] User can input or select context text
- [ ] User can input a question
- [ ] Submit triggers backend API call
- [ ] Loading state shown during request
- [ ] Success state shows AI-generated answer
- [ ] Error state shows helpful message
- [ ] Empty state provides example questions
- [ ] Works on mobile viewports

---

### 2.2 AI Capability — Context-Based Only

**Requirement ID:** UPD-AI-02
**Priority:** Must

The Phase 1 AI assistant must answer questions based **only** on supplied or selected text context. No RAG, no vector search, no document indexing.

**Interaction Model:**
1. Visitor provides article text/content as context, or selects supported article content
2. Visitor provides a question related to the supplied context
3. Backend securely sends request to configured AI provider
4. AI produces answer grounded only in supplied context
5. UI displays answer clearly

**AI System Prompt Rules:**
- Use only the provided context
- Do not invent facts not present in the context
- Clearly state when answer cannot be found in supplied context
- Maintain professional energy-analysis tone
- Avoid representing generated responses as verified research unless source supports it

**Acceptance Criteria:**
- [ ] Backend sends context + question to AI provider
- [ ] AI response is grounded in provided context
- [ ] System prompt enforces grounding rules
- [ ] When context lacks answer, AI states this explicitly
- [ ] No hallucinated statistics, sources, or geopolitical claims

---

### 2.3 AI Purpose and Positioning

**Requirement ID:** UPD-AI-03
**Priority:** Must

Client's intended purpose: AI tools should help visitors understand Algeria and European Union ties in the energy field.

**Reflect this in:**
- Homepage AI assistant heading and supporting text
- Empty-state example questions
- AI response tone
- AI-related descriptive content

**Example Questions for Empty State:**
- "What role does Algeria play in Europe's energy security according to this article?"
- "What does this analysis say about the Nigeria-Algeria-Europe pipeline?"
- "Summarize the main energy cooperation opportunities discussed in this content."

**Acceptance Criteria:**
- [ ] Homepage section text reflects Algeria-Europe energy focus
- [ ] Example questions are energy-relevant and context-based
- [ ] AI responses maintain professional analyst tone

---

### 2.4 Future Data Bank / RAG Direction — Correctly Communicated

**Requirement ID:** UPD-AI-04
**Priority:** Must

Do NOT build full data bank, RAG pipeline, vector database, or source-indexed AI search in Phase 1.

**BUT** — the UI and documentation must make the future roadmap clear.

**Future roadmap mentions:**
- Published platform articles
- Government sources
- Energy reports
- News and research publications
- Curated reference materials

**Future system may include:**
- RAG workflow
- Document indexing
- Vector database
- Source citations
- Multilingual AI search
- Larger Algeria-Europe energy knowledge base

**Acceptance Criteria:**
- [ ] Phase 1 UI does not falsely suggest complete searchable database
- [ ] Clear disclaimer: "Phase 1 answers are based on supplied content only"
- [ ] Future roadmap is documented in UI and docs
- [ ] No RAG/vector/pgvector code in Phase 1

---

### 2.5 Article Summarization — Visitor-Facing

**Requirement ID:** UPD-AI-05
**Priority:** Must

Implement visitor-facing article summarization on the Article Detail page.

**Feature Title:** "Summarize This Article"

**Behavior:**
- Visitor opens article detail page
- Visitor clicks to request AI-generated summary
- Backend sends existing article content securely to AI provider
- UI displays summary without manual paste
- Loading, failure, and retry behavior included
- Summary is concise, professional, grounded in article content

**Acceptance Criteria:**
- [ ] Summarize button/control on article detail page
- [ ] Backend fetches article content and sends to AI
- [ ] Loading state during generation
- [ ] Error state with retry option
- [ ] Summary displayed in readable panel
- [ ] No manual paste required by visitor
- [ ] No advanced citation extraction or cross-document research

---

## 3. Unchanged Original Requirements

These remain exactly as specified in the original documents:

### 3.1 Public Pages
- Homepage with all original sections (hero, mission, featured analysis, etc.)
- About/Profile page with Mr. Ramdane's background
- News/Analysis listing with categories
- Article detail with metadata and source link
- Research/Publication listing with cards

### 3.2 CMS Requirements
- Supabase Auth admin login
- Article CRUD (create, edit, delete with confirmation)
- Publication CRUD
- Protected admin routes
- Draft/published status for articles

### 3.3 Database Schema
- Articles table with all specified fields
- Publications table with all specified fields
- Proper migrations and types

### 3.4 Security
- AI API key server-side only
- Input validation
- Sanitization
- No secret exposure in frontend
- Admin auth required for CMS actions

### 3.5 Design
- Professional, institutional, Ifri-inspired
- Deep navy and muted teal palette
- Clean editorial hierarchy
- Responsive (desktop, tablet, mobile)

---

## 4. Explicitly Excluded from Phase 1

These remain explicitly out of scope:

- Full RAG workflow
- Vector database / pgvector
- Large document / PDF indexing
- PDF Q&A
- Automated news crawling
- Interactive energy map
- Advanced dashboards
- Subscription or payment system
- Premium member area
- Enterprise user management
- Full multilingual AI workflow
- Predictive AI
- Full SaaS automation
- Real-time energy data API
- ESG/carbon analytics
- Mobile app

---

## 5. Updated Acceptance Criteria by Feature

### Homepage AI Assistant
1. Section visible and functional on homepage
2. Context input + question input + submit
3. All UI states (empty, loading, error, success) implemented
4. Response grounded in supplied context only
5. Professional tone maintained
6. Responsive on all viewports
7. Clear disclaimer about Phase 1 limitations

### Article Summarization
1. Control present on every article detail page
2. Fetches article content automatically
3. Loading, error, retry states
4. Concise professional summary displayed
5. No visitor manual input required

### CMS
1. Secure login with Supabase Auth
2. Article create/edit/delete with validation
3. Publication create/edit/delete with validation
4. Draft/published status support
5. Protected routes (unauthorized = redirect to login)

### Public Website
1. All 5 pages implemented and navigable
2. Responsive on common viewports
3. Professional institutional styling
4. Placeholder content clearly labeled where real content unavailable

---

## 6. Requirement Change Log

| Date | Change | Rationale |
|------|--------|-----------|
| 2026-05-25 | Baseline scope signed | Original agreement |
| 2026-05-29 | AI assistant changed from preview to functional | Stakeholder update |
| 2026-05-29 | Article summarization changed to visitor-facing | Stakeholder update |
| 2026-05-29 | Added explicit grounding rules for AI | Quality/safety requirement |
| 2026-05-29 | Added future RAG communication requirement | Transparency requirement |

---

## 7. Sign-off

This updated requirements document overrides the original scope where explicitly stated. All other original requirements remain in force.

**Developer:** OpenClaw Agent
**Date:** 2026-05-29
**Status:** Awaiting implementation commencement
