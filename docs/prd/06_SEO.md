# PRD-06: SEO Optimization

**Feature ID:** F06
**Version:** 1.0
**Date:** 2026-06-14
**Status:** Draft — awaiting review
**Estimated Effort:** ~7 days
**Depends On:** All pages built (F01, F04, F05); can start pre-work earlier
**Index:** ← [Back to PRD Index](./00_INDEX.md)

---


## 6. SEO

### 6.1 Problem Statement

The site has minimal SEO configuration:
- Basic `metadata` in `layout.tsx` only
- No `sitemap.xml`
- No `robots.txt`
- No structured data (JSON-LD)
- No canonical URLs
- Missing page-specific metadata on most routes
- `og:image` not configured

For an energy intelligence platform targeting professionals and researchers, organic search is a critical acquisition channel.

### 6.2 Goals

- Implement `sitemap.xml` (dynamic, generated from all published content)
- Implement `robots.txt`
- Add structured data (JSON-LD): Organization, Article, BreadcrumbList, FAQ (for AI page)
- Add canonical URLs on all pages
- Complete metadata on every page: title, description, og:image, og:type
- Social share images (Open Graph) for key pages
- Schema markup for Energy Projects (Project structured data)
- `hreflang` tags for multilingual pages (EN, FR)
- Verify Core Web Vitals (LCP, INP, CLS) pass Google thresholds
- Register site with Google Search Console and submit sitemap

### 6.3 Technical Design

#### Sitemap (`src/app/sitemap.ts`)

```typescript
// Next.js App Router built-in sitemap generation
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rambelenergy.com";

  // Dynamic: fetch all published articles
  const articles = await getPublishedArticles();
  const publications = await getPublications();
  const projects = await getEnergyProjects();

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/analysis`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/research`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/energy-focus`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/global-map`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/energy-prices`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.9 },
    { url: `${baseUrl}/energy-projects`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/ai-assistant`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    // Dynamic articles
    ...articles.map(a => ({
      url: `${baseUrl}/analysis/${a.slug}`,
      lastModified: new Date(a.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    // Dynamic publications
    ...publications.map(p => ({
      url: `${baseUrl}/research/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // Dynamic projects
    ...projects.map(p => ({
      url: `${baseUrl}/energy-projects/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
```

#### robots.txt (`src/app/robots.ts`)

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rambelenergy.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/dashboard/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

#### Structured Data — Organization (in layout)

```typescript
// Add to RootLayout
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "RamBelEnergy",
  "url": "https://rambelenergy.com",
  "description": "Independent analysis on Algeria–Europe energy relations",
  "logo": "https://rambelenergy.com/logo.png",
  "sameAs": [
    // Add social profiles when available
  ],
  "founder": {
    "@type": "Person",
    "name": "Ramdane Belamri"
  }
};
```

#### Structured Data — Article (per article page)

```typescript
// Add to /analysis/[slug]/page.tsx
const articleSchema = (article: Article) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "datePublished": article.published_at,
  "dateModified": article.updated_at,
  "author": {
    "@type": "Person",
    "name": article.author
  },
  "description": article.excerpt,
  "url": `https://rambelenergy.com/analysis/${article.slug}`,
  "publisher": {
    "@type": "Organization",
    "name": "RamBelEnergy",
    "logo": {
      "@type": "ImageObject",
      "url": "https://rambelenergy.com/logo.png"
    }
  }
});
```

#### Structured Data — BreadcrumbList

```typescript
// Reusable component for all pages
const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": item.name,
    "item": item.url,
  })),
});
```

#### Page-Level Metadata

Every page needs complete metadata:

```typescript
// Pattern for every page.tsx
export const metadata: Metadata = {
  title: "Energy Prices | RamBelEnergy",
  description: "Real-time energy commodity prices: crude oil (Brent, WTI), natural gas (Henry Hub, TTF), LNG benchmarks. Updated throughout the trading day.",
  alternates: {
    canonical: "https://rambelenergy.com/energy-prices",
    languages: {
      "en": "https://rambelenergy.com/energy-prices",
      "fr": "https://rambelenergy.com/fr/energy-prices",
    },
  },
  openGraph: {
    title: "Live Energy Prices — Crude Oil & Natural Gas Benchmarks",
    description: "Real-time energy commodity prices updated throughout the trading day.",
    url: "https://rambelenergy.com/energy-prices",
    siteName: "RamBelEnergy",
    images: [{
      url: "https://rambelenergy.com/og/energy-prices.png",
      width: 1200,
      height: 630,
    }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live Energy Prices — RamBelEnergy",
    description: "Real-time energy commodity prices. WTI, Brent, Henry Hub, TTF benchmarks.",
    images: ["https://rambelenergy.com/og/energy-prices.png"],
  },
};
```

#### hreflang Tags

For the multilingual setup (EN + FR):

```typescript
// In layout or per-page metadata
alternates: {
  languages: {
    "en": "https://rambelenergy.com/energy-prices",
    "fr": "https://rambelenergy.com/fr/energy-prices",
  },
}
```

#### OG Image Generation

Create share images at `public/og/`:
- `og-default.png` — generic RamBelEnergy share image (1200×630)
- `og-energy-prices.png` — Energy Prices specific
- `og-energy-projects.png` — Projects specific

Or use `@vercel/og` for dynamic image generation on key pages.

#### Redirects Configuration

```typescript
// next.config.ts additions
async redirects() {
  return [
    // Existing
    { source: "/ai-preview", destination: "/ai-assistant", permanent: true },
    // New: SEO-friendly aliases
    { source: "/prices", destination: "/energy-prices", permanent: true },
    { source: "/projects", destination: "/energy-projects", permanent: true },
  ];
},
async headers() {
  return [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ];
},
```

#### Verification Checklists

| Check | Tool |
|-------|------|
| All pages have unique `<title>` and `<meta description>` | Manual / Screaming Frog |
| Sitemap accessible at `/sitemap.xml` | Browser |
| robots.txt accessible at `/robots.txt` | Browser |
| JSON-LD valid (no errors) | [Schema Markup Validator](https://validator.schema.org/) |
| Canonical URLs correct (no duplicates) | Browser inspect |
| OG tags render correctly in social previews | [opengraph.xyz](https://opengraph.xyz/) |
| Core Web Vitals pass (LCP < 2.5s, INP < 200ms, CLS < 0.1) | PageSpeed Insights |
| Mobile-friendly | Google Mobile-Friendly Test |
| No broken internal links | Screaming Frog |
| hreflang tags valid | hreflang checker |

### 6.4 Acceptance Criteria

- [ ] `sitemap.xml` dynamically generated with all published content
- [ ] `robots.txt` configured, blocks `/admin/`, `/api/`, `/dashboard/`
- [ ] JSON-LD Organization schema on every page (via layout)
- [ ] JSON-LD Article schema on every article detail page
- [ ] JSON-LD BreadcrumbList on all content pages
- [ ] JSON-LD Project schema on energy projects
- [ ] All pages have unique `title` and `description` meta tags
- [ ] All pages have `og:title`, `og:description`, `og:image`, `og:url`
- [ ] Canonical URLs on all pages (no www/non-www duplicates)
- [ ] `hreflang` tags for EN/FR versions
- [ ] Security headers: X-Content-Type-Options, X-Frame-Options, Referrer-Policy
- [ ] Share images exist for top 5 pages
- [ ] Google Search Console registered + sitemap submitted
- [ ] Lighthouse SEO score ≥ 90

### 6.5 Scope & Estimates

| Task | Estimate | Depends On |
|------|----------|------------|
| `sitemap.ts` + `robots.ts` | 0.5 day | — |
| Organization + Breadcrumb JSON-LD (layout) | 0.5 day | — |
| Article JSON-LD (article detail pages) | 0.5 day | — |
| Page-level metadata: all existing pages | 1 day | — |
| New pages metadata (prices, projects, dashboard) | 0.5 day | Features 1,4,5 |
| `hreflang` tags for EN/FR | 0.5 day | — |
| OG share images (5 images) | 0.5 day | — |
| Security headers (next.config.ts) | 0.5 day | — |
| Canonical URL audit + fixes | 0.5 day | — |
| Redirect cleanup / new aliases | 0.5 day | — |
| Core Web Vitals audit + fixes | 1 day | All pages built |
| Google Search Console setup | 0.5 day | Deployed |
| **Total** | **~7 days** | |

---

