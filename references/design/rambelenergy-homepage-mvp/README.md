# RamBelEnergy.com — Phase 1 Homepage MVP

A production-oriented homepage UI implementation for RamBelEnergy.com using Next.js App Router, TypeScript, and Tailwind CSS.

## Included

- `app/page.tsx` — assembled homepage
- `components/` — reusable homepage/UI components
- `data/homepage.ts` — typed mock CMS-ready content
- `public/hero-energy-route.svg` — local editorial energy-route visual placeholder
- responsive desktop/tablet/mobile navigation and layout
- AI Preview as non-functional UI only, within Phase 1 scope

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## CMS integration path

The page reads content from `data/homepage.ts`. Later, replace imports in `app/page.tsx` with Supabase-backed server queries returning the same TypeScript shapes: `Article`, `Publication`, `FocusArea`, `StrategicItem`, and `NavItem`.

## Scope intentionally excluded

No RAG implementation, vector database, crawling, subscription functionality, multilingual publishing system, or live API integration is included.

## About / Profile page

The Phase 1 implementation now includes `app/about/page.tsx` with reusable components and typed local content in `data/about.ts`.

Included About sections:
- Institutional breadcrumb and page hero
- Professional portrait placeholder and approved-safe profile biography
- Platform mission and mission-point blocks
- Core focus area cards
- Editorial values
- Future vision with non-functional AI roadmap note
- Collaboration CTA and shared footer

The profile copy is intentionally limited to approved placeholder wording and is ready to be replaced with the final biography and portrait asset.
