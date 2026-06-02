# Multilingual Client-Side Language Support — Phase 1

## Overview

RamBelEnergy now supports client-side language selection for English, French, and Arabic on the public website. This is a **client-side UI translation system** — it does not involve a full multilingual CMS or AI translation pipeline.

## Supported Languages

| Code | Language    | Direction | Script   |
|------|-------------|-----------|----------|
| `en` | English     | LTR       | Latin    |
| `fr` | Français    | LTR       | Latin    |
| `ar` | العربية     | RTL       | Arabic   |

## How Language Switching Works

1. A **language switcher** is located in the public website header (top utility bar on desktop, and inline in the main nav on all breakpoints).
2. User selects a language from the dropdown — options display native labels (English, Français, العربية).
3. The selection is **persisted to `localStorage`** under the key `rambelenergy-lang`.
4. On page load, the stored preference is read and applied.
5. When Arabic is selected, the `<html>` element receives `dir="rtl"` and `lang="ar"`.
6. When English or French is selected, `dir="ltr"` and the corresponding `lang` attribute are set.

## Architecture

### Files Created

- `src/lib/i18n/types.ts` — Type definitions, `Language` type, language list, `TranslationKey` union type
- `src/lib/i18n/translations.ts` — Full translation maps for en/fr/ar (~150 keys)
- `src/components/language/language-provider.tsx` — React Context provider, localStorage persistence, RTL management
- `src/components/language/language-switcher.tsx` — Dropdown language selector UI
- `src/components/language/t.tsx` — Thin `<T k="key" />` client wrapper for server component usage

### Files Updated

- `src/app/layout.tsx` — Wrapped children with `<LanguageProvider>`
- `src/components/layout/Header.tsx` — Added language switcher, translated all nav labels, top bar, user menu, mobile menu
- `src/components/layout/Footer.tsx` — Translated column headings, location, contact text, CTA
- `src/app/(site)/page.tsx` — Translated hero, AI section, strategic section, analysis/research/focus headings, about section, CTA
- `src/app/(site)/about/page.tsx` — Translated breadcrumb, section headings, future vision
- `src/components/content/HomeAssistantSection.tsx` — Fully translated AI assistant panel (labels, placeholders, buttons, error states, response area)
- `src/components/content/CTASection.tsx` — Translated eyebrow badge
- `src/components/content/SectionHeading.tsx` — Updated types to accept `ReactNode` for translated content
- `src/components/content/SummarizeBox.tsx` — Translated title
- `src/components/content/ArticleContactCTA.tsx` — Fully translated
- `src/components/content/RelatedAnalysis.tsx` — Translated headings and "Read more"
- `src/app/(site)/analysis/page.tsx` — Translated breadcrumb, page title, section labels
- `src/lib/ai/validate.ts` — Added language parameter validation (`en`/`fr`/`ar`)
- `src/lib/ai/provider.ts` — Added language instruction to AI system prompt
- `src/app/api/ai/route.ts` — Passes language through to provider
- `src/app/globals.css` — Added comprehensive RTL styles for Arabic

### Usage in Code

**Client components** (use the hook):
```tsx
"use client";
import { useLanguage } from "@/components/language/language-provider";
// ...
const { t, language } = useLanguage();
return <span>{t("nav.home")}</span>;
```

**Server components** (use the `<T>` wrapper):
```tsx
import { T } from "@/components/language/t";
return <h1><T k="home.hero.title" /></h1>;
```

## Arabic RTL Handling

When Arabic is selected:

- `document.documentElement.dir` is set to `"rtl"`
- `document.documentElement.lang` is set to `"ar"`
- CSS handles:
  - Text alignment (right-aligned body text)
  - Navigation underline animation position flip
  - Icon arrow directions reversed via `scaleX(-1)`
  - Feature card left border becomes right border
  - Blockquote border moves from left to right
  - Breadcrumb chevrons flipped
  - Button hover arrow animations adjusted

## What Is Translated

- ✅ All navigation labels
- ✅ Hero headings and CTAs
- ✅ AI assistant panel (full UI)
- ✅ Section headings and descriptions on homepage
- ✅ About page section headings
- ✅ Footer labels and links
- ✅ Article summary component
- ✅ Related articles component
- ✅ Article contact CTA
- ✅ Breadcrumbs

## What Remains Original / CMS-Controlled

- ❌ CMS article bodies (stored in original language)
- ❌ CMS publication descriptions
- ❌ Profile biography text
- ❌ Energy focus area descriptions from CMS
- ❌ Analysis/article content from database
- ❌ Admin dashboard (not translated — Phase 1 scope is public site only)

## AI Assistant Language Behavior

- The AI assistant now passes `language` (`en`/`fr`/`ar`) to the backend API.
- The backend validates the language parameter server-side.
- When a non-English language is selected, the system prompt instructs the AI to respond in that language.
- The AI assistant UI itself is fully translated in all three languages.

## Known Limitations

1. **CMS content is not translated**: Article bodies, publication texts, and profile biographies remain in their original stored language.
2. **Admin panel is not translated**: The CMS dashboard remains in English.
3. **Some inner page static text** (analysis listing cards, research listing, contact page, energy focus, AI assistant page) still has some English fallbacks — these can be extended in a follow-up.
4. **No URL-based locale routing**: Language is purely client-side via localStorage, not reflected in URLs (`/en/`, `/fr/`, `/ar/`).
5. **No automatic RTL for dynamic CMS content**: CMS content written in Arabic will not automatically apply RTL styling unless the document direction is already RTL (which it is when Arabic is selected).

## Next Phase Suggestions

For full multilingual support in a future phase:

1. **URL-based locale routing** (`/en/analysis/...`, `/fr/analysis/...`, `/ar/analysis/...`)
2. **Multilingual CMS**: Database schema extension for translated article/publication content
3. **AI translation pipeline**: Optional AI-powered translation of CMS content
4. **Full static page translation**: Extend translation coverage to all inner pages
5. **Admin panel i18n**: Translate the CMS dashboard
6. **SEO**: hreflang tags, localized metadata, sitemap extensions
