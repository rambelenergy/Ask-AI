# PRD-05: Energy Projects in Algeria Page

**Feature ID:** F05
**Version:** 1.0
**Date:** 2026-06-14
**Status:** Draft — awaiting review
**Estimated Effort:** ~7.5 days
**Depends On:** None (independent) — but SEO (F06) will add structured data later
**Index:** ← [Back to PRD Index](./00_INDEX.md)

---


## 5. Energy Projects in Algeria

### 5.1 Problem Statement

The site focuses on Algeria-Europe energy relations but has no dedicated page for active Algerian energy projects. Visitors researching the context cannot easily find:

- Major pipeline projects (Trans-Saharan, Medgaz, Transmed, GALSI)
- Renewable energy initiatives (Solar 15 GW plan, SoutH2 Corridor)
- LNG infrastructure (Skikda, Arzew terminals)
- Interconnection projects (ELMED Algeria-Italy)

### 5.2 Goals

- Create a visually rich **Energy Projects in Algeria** page (`/energy-projects`)
- Organize projects by category: Pipelines, Renewables, LNG, Interconnections, Upstream
- Each project card shows: name, category, status (operational/under construction/planned), capacity, key partners, description
- Interactive map visualization (optional, Phase 2b) showing project locations
- Data sourced from CMS admin (editable, not hardcoded)
- Links to related articles and analysis on the platform

### 5.3 User Stories

| ID | As a... | I want to... | So that... |
|----|---------|--------------|------------|
| EP-01 | Researcher | Browse all Algerian energy projects in one place | I can understand the full landscape |
| EP-02 | Investor | Filter projects by category and status | I can focus on areas of interest |
| EP-03 | Admin | Add/edit projects via CMS | Content stays up to date |
| EP-04 | General reader | Click from project to related analysis | I can read deeper coverage |

### 5.4 Technical Design

#### Database Schema

```sql
CREATE TABLE energy_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN (
    'pipeline', 'renewable', 'lng', 'interconnection', 'upstream', 'hydrogen', 'other'
  )),
  status TEXT NOT NULL CHECK (status IN (
    'operational', 'under_construction', 'planned', 'proposed', 'completed', 'suspended'
  )),
  description TEXT NOT NULL,
  capacity TEXT,                 -- e.g., "30 bcm/year" or "15 GW"
  location TEXT,                 -- e.g., "Hassi R'Mel – Arzew"
  partners TEXT[],               -- e.g., ["Sonatrach", "Eni", "TotalEnergies"]
  estimated_cost TEXT,           -- e.g., "$2.5 billion"
  timeline TEXT,                 -- e.g., "2024–2028"
  image_url TEXT,                -- project photo or map
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  related_article_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Page Structure

```
/energy-projects
├── Hero: "Energy Projects in Algeria" + description
├── Filter bar: category pills + status dropdown
├── Project grid: cards (3 cols desktop, 1 col mobile)
│   ├── ProjectCard: image, name, status badge, category badge, description excerpt
│   └── Click → Expand or modal with full details
├── Map section (Phase 2b): interactive Algeria map with project markers
└── CTA: "Read Analysis" linking to /analysis
```

#### Project Card Design

```
┌──────────────────────────────────────────┐
│ ┌──────────────────────────────────────┐ │
│ │         Project Image / Map          │ │
│ └──────────────────────────────────────┘ │
│                                          │
│  🟢 Operational    📦 Pipeline           │
│                                          │
│  Medgaz Gas Pipeline                     │
│  Algeria → Spain (Almería)               │
│  8 bcm/year capacity                     │
│                                          │
│  Sonatrach · Naturgy · ...              │
│                                          │
│  Direct subsea pipeline connecting       │
│  Beni Saf, Algeria to Almería, Spain...  │
│                                          │
│  [Read Related Analysis →]               │
└──────────────────────────────────────────┘
```

#### Status Badges (with color)

| Status | Color | Emoji |
|--------|-------|-------|
| Operational | Green | 🟢 |
| Under Construction | Amber | 🟡 |
| Planned | Blue | 🔵 |
| Proposed | Gray | ⚪ |
| Completed | Dark green | ✅ |
| Suspended | Red | 🔴 |

#### Admin CMS

- **Projects list** (`/admin/projects`): table with name, category, status, actions
- **Create/Edit form** (`/admin/projects/new`, `/admin/projects/[id]/edit`):
  - Name, slug (auto from name), category (select), status (select)
  - Description (rich text), capacity, location, partners (tag input)
  - Estimated cost, timeline, featured toggle, sort order
  - Related articles (multi-select from published articles)
  - Image upload (Supabase Storage)

#### Suggested Initial Projects

| Name | Category | Status | Capacity |
|------|----------|--------|----------|
| Transmed Pipeline (Enrico Mattei) | Pipeline | Operational | 33 bcm/year |
| Medgaz Pipeline | Pipeline | Operational | 8→10 bcm/year |
| Trans-Saharan Gas Pipeline (TSGP) | Pipeline | Planned | 30 bcm/year |
| GALSI Pipeline | Pipeline | Proposed | 8 bcm/year |
| Solar 15 GW Programme | Renewable | Under Construction | 15 GW |
| SoutH2 Corridor | Hydrogen | Planned | 4 Mt/year |
| ELMED Interconnection | Interconnection | Under Construction | 600 MW |
| Skikda LNG Terminal | LNG | Operational | Various |
| Arzew LNG Complex | LNG | Operational | Various |
| Hassi R'Mel Gas Field | Upstream | Operational | ~100 bcm/year |
| Touat Gas Project | Upstream | Operational | 4.5 bcm/year |
| Reggane Nord Gas Project | Upstream | Operational | Various |

### 5.5 Acceptance Criteria

- [ ] `/energy-projects` page renders with all active projects
- [ ] Filter by category works (click pill, show matching projects)
- [ ] Filter by status works (dropdown: all, operational, planned, etc.)
- [ ] Project cards show: image, name, status badge, category, capacity, description
- [ ] Clicking a project expands details (modal or dedicated page)
- [ ] Related analysis links navigate to matching articles
- [ ] Admin can add/edit/delete projects via CMS
- [ ] Project images stored in Supabase Storage
- [ ] Mobile: single column layout, filter bar stacks vertically
- [ ] Page is SEO-optimized (meta, OG, structured data)

### 5.6 Scope & Estimates

| Task | Estimate | Depends On |
|------|----------|------------|
| `energy_projects` migration + types | 0.5 day | — |
| Admin project CRUD (form, list, delete) | 2 days | Migration |
| `ProjectCard` + `ProjectGrid` components | 1 day | Types |
| `/energy-projects` page | 1 day | Components |
| Filter bar (category + status) | 0.5 day | Page |
| Project expand/modal | 0.5 day | Page |
| Project image upload (Storage) | 0.5 day | CRUD |
| Seed 12 initial projects | 0.5 day | CRUD |
| Responsive + states | 0.5 day | All UI |
| SEO + structured data | 0.5 day | Page |
| **Total** | **~7.5 days** | |

---

