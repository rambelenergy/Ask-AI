# Phase 2a — Live Energy Prices & Algeria Project Map

**RamBelEnergy.com**  
**June 2026**  
**Project Value: $800**

---

## What We're Building

Two new features for RamBelEnergy.com:

### 1. Live Energy Prices
Real-time energy commodity prices displayed on the website — with Saharan Blend as the primary benchmark for Algeria.

### 2. Algeria Energy Projects Database
An interactive map and project database tracking all energy infrastructure projects across Algeria — pipelines, solar plants, LNG terminals, and more.

---

## Feature 1 — Live Energy Prices

### What You'll See

**Homepage Ticker** — A scrolling banner at the top of the homepage showing live energy prices:
- Saharan Blend (Algerian crude) ★
- Brent (global benchmark)
- WTI (US benchmark)
- OPEC Basket (reference)

Each price shows the current value, whether it went up or down, and which source provided it.

**Energy Prices Page** (`/energy-prices`) — A full dashboard with all 7 benchmarks displayed as cards. Click any price to dive deeper.

**Intelligence Pages** (`/intelligence/saharan-blend`, `/intelligence/brent`, etc.) — Clicking a price opens a detailed page with:
- Current price with full details
- Historical trend chart (7 days / 30 days / 90 days / 1 year)
- Country context (production data, export destinations, key infrastructure)
- Related benchmarks for comparison
- Source references and official reports

### Key Points
- Prices auto-refresh every 5 minutes
- Every price shows: source, last update time, confidence level
- If a source is temporarily unavailable, it shows "Temporarily unavailable" (never exposes technical details to users)
- All prices saved to database for future analytics

### Sources We Use
| Priority | Source | What It Provides |
|----------|--------|------------------|
| Primary | Platts / Argus (subscription) | Saharan Blend, Brent, WTI, Murban, TTF |
| Validation | OPEC (free) | OPEC Basket reference price |
| Fallback | OilPrice.com (free) | Backup when primary is down |
| Supplemental | EIA (free) | Henry Hub (US natural gas) |

---

## Feature 2 — Algeria Energy Projects Database

### What You'll See

**Projects Page** (`/energy-projects`) — A filterable database of Algerian energy projects:

- **Filter by category:** Oil & Gas, Renewable, LNG, Power, Hydrogen
- **Filter by status:** Operational, Under Construction, Planned, Proposed
- **Filter by location** (wilaya/province)
- **Search** by project name

Each project card shows:
- Project name and route/location
- Status badge (🟢 Operational, 🟡 Under Construction, 🔵 Planned)
- Capacity (e.g., "10 bcm/year", "15 GW")
- Operating company and partners
- Source attribution with last-updated date

**Interactive Map** — A full map of Algeria with project locations marked by colored pins. Click any pin to see a popup with project name, status, and capacity. Click through to full project details.

**Project Detail** — Tap any project card to expand and see all information:
- Description, location, GPS coordinates
- Capacity, investment value
- Operator and partners
- Start date, expected completion
- All original sources linked
- Update history timeline

### Where Data Comes From

The system automatically collects project information from **19 official sources**:

| Category | Sources |
|----------|---------|
| Algerian Official | Ministry of Energy, Sonatrach, Sonelgaz, ALNAFT, AAPI, JORADP |
| International Organizations | World Bank, IEA, OPEC, Global Energy Monitor, African Development Bank |
| News | Reuters Energy |
| Operating Companies | Eni, TotalEnergies, BP, Equinor, ExxonMobil, Chevron, Occidental |

### How It Works

1. **Automatic Collection** — The system checks all 19 sources every 6-12 hours for new information
2. **AI Extraction** — Artificial intelligence reads the pages and extracts structured project data
3. **Review by Admin** — New or changed projects appear in a review queue. Admin approves, edits, or rejects before anything goes live
4. **Published** — Approved projects appear on the website with full source attribution

### What This Means
- The project database **updates itself** — no manual data entry
- Every project links back to its **original source** — fully verifiable
- Admin has **final approval** on everything — accuracy is controlled
- Projects not updated by any source for 30+ days are **flagged for review**

---

## Timeline

| Week | What Happens |
|------|-------------|
| **Week 1** | Set up database + build price data pipeline |
| **Week 2** | Build price display (ticker, dashboard, intelligence pages) + start project crawlers |
| **Week 3** | Build AI extraction pipeline + admin review system |
| **Week 4** | Build project pages + interactive map |
| **Week 5** | Integration, testing, mobile optimization, deployment |

**Total: ~5 weeks (25 working days)**

---

## What You Get

| Deliverable | Description |
|-------------|-------------|
| Homepage price ticker | Scrolling live prices — always visible |
| `/energy-prices` page | Full dashboard with 7 benchmarks |
| `/intelligence/[benchmark]` pages | Detailed view per benchmark with charts and context |
| `/energy-projects` page | Filterable project database |
| Interactive Algeria map | Leaflet map with project markers and popups |
| Admin review system | Approve/edit/reject incoming project data |
| Automated data pipeline | 19 sources checked every 6-12 hours |
| Mobile responsive | All pages work on phones and tablets |
| Multilingual ready | French / English / Arabic support |

---

## Payment Terms

| Stage | Percentage | Amount | When |
|-------|-----------|--------|------|
| **Down Payment** | 50% | **$400** | At project start |
| **Completion** | 30% | **$240** | When all features are built and deployed |
| **Final** | 20% | **$160** | After bug fixes and user review |

**Total Project Value: $800**

---

## Contact

For questions or to begin:
- **Developer:** Junaedi
- **Project:** RamBelEnergy.com — rambelenergy-development
- **Repository:** Private GitHub

---

*Document prepared for client review — June 2026*
