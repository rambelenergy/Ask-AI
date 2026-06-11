# Ask Energy — Technical Accuracy Improvements

> Companion to `docs/accuracy-benchmark.md`
> Priority order: highest-impact first

## 1. Source Verification

### 1.1 Live Price Validation (DONE)
**Problem:** Search snippets are stale index snapshots. Dynamic pages (`eia.gov/prices.php`) show fresh data on the live page but Brave/LangSearch snippets are days old.

**Solution:** `fetch-live-prices.ts` — HTTP GET the actual page and extract numbers via regex before the AI sees them.

**Status:** ✅ Implemented for EIA, oilprice.com, tradingeconomics.com, oilmarketcap.com, businessinsider.com commodities.

**Next:** Add more dynamic price URLs as trusted sources grow.

### 1.2 Cross-Reference Verification (RECOMMENDED)
**Problem:** AI still trusts a single source if it's the only one with data.

**Solution:** When only 1 source has a price and others don't, flag it. Require ≥2 independent sources for financial numbers.

```ts
// In build-answer-prompt.ts instruction:
"PRICE VERIFICATION: If only ONE source provides a specific price number, 
prefix it with 'According to [Source] alone:' instead of stating it as fact. 
When ≥2 sources agree on a number within 5%, present it as confirmed."
```

### 1.3 Source Staleness Watermark (RECOMMENDED)
**Problem:** Users can't see how old a source is in the UI.

**Solution:** Add an age badge next to each source in the chat UI:
```
🟢 eia.gov (updated today)
🟡 oilprice.com (2 days ago)  
🔴 reuters.com (12 days ago)
```

## 2. Numerical Validation

### 2.1 Anti-Synthesis Rules (DONE)
**Problem:** AI averages numbers from different sources (90.29 + 93.68 → 92.66).

**Solution:** 6-rule anti-hallucination section in system prompt forbidding calculation, averaging, or range-synthesis.

**Status:** ✅ In `build-answer-prompt.ts`.

### 2.2 Regex-Based Price Sanity Check (RECOMMENDED)
**Problem:** No automated check that output numbers match input source numbers.

**Solution:** Post-process the AI output before streaming. Extract all `$XX.XX` from the source snippets/live data. Check that every `$XX.XX` in the AI response exists verbatim in at least one source.

```ts
// Sanity check before streaming to user
function validateNumbers(aiOutput: string, sourceData: string[]): string[] {
  const outputNumbers = aiOutput.match(/\$\d{2,3}\.\d{2}/g) || [];
  const sourceNumbers = new Set(
    sourceData.flatMap(s => s.match(/\$\d{2,3}\.\d{2}/g) || [])
  );
  return outputNumbers.filter(n => !sourceNumbers.has(n));
  // If any found → log warning, inject disclaimer
}
```

### 2.3 Outlier Detection (RECOMMENDED)
**Problem:** AI sometimes picks up an old/erroneous price and presents it alongside correct ones.

**Solution:** When multiple sources provide the same metric (e.g., WTI price), detect outliers >10% from the median and exclude or flag them.

## 3. Multilingual Consistency

### 3.1 Shared Source Pool (CURRENT)
**Problem:** The search language parameter (`search_lang`) affects which pages Brave/LangSearch return. Arabic `search_lang: "ar"` may return different pages than English `search_lang: "en"`.

**Solution:** Always run the ORIGINAL language query AND an English fallback query. Merge results. This ensures the same source pool regardless of input language.

**Status:** `expandEnergyQuery` already injects English keywords for non-English queries. But Brave's `search_lang` still affects ranking.

**Fix:** Run Brave with BOTH the detected language AND `"en"` in parallel, merge results. Costs +1 API call per query but guarantees source consistency.

### 3.2 Price Number Consistency Check (RECOMMENDED)
**Problem:** AI might translate "ninety-three dollars" differently than "$93.68" across languages.

**Solution:** In the system prompt, add: "When presenting prices, ALWAYS use the format `$XX.XX` regardless of the response language. Do not translate numbers or write them out as words."

### 3.3 Unit Consistency (RECOMMENDED)
**Problem:** Different languages may use different unit conventions (billion vs. milliard, barrel vs. tonne).

**Solution:** System prompt rule: "Always state units in their original form from the source. If a source says 'bcm/year', output 'bcm/year' — do not convert or translate units."

## 4. Process & Monitoring

### 4.1 Automated Accuracy Tests (CREATED)
**File:** `scripts/test-accuracy.mjs`
**Usage:**
```bash
# Run all English benchmarks
node scripts/test-accuracy.mjs

# Run single question
node scripts/test-accuracy.mjs --question Q1.1

# Test all languages for consistency
node scripts/test-accuracy.mjs --question Q7.1

# Run with specific language
node scripts/test-accuracy.mjs --language ar
```

### 4.2 CI Integration (RECOMMENDED)
Add to GitHub Actions / pre-deploy checklist:
```yaml
- name: Accuracy Smoke Test
  run: |
    node scripts/test-accuracy.mjs --question Q1.1
    # Fail if score < 35/50
```

### 4.3 Daily Accuracy Report (RECOMMENDED)
Set up a cron job that runs the benchmark suite daily and posts results to a Slack/Discord channel.

### 4.4 Source Freshness Heatmap (RECOMMENDED)
Track which sources consistently provide fresh data vs. stale data. Use this to adjust priority weights dynamically.

## 5. Prompt Engineering Improvements

### 5.1 Source Provenance in Every Sentence (RECOMMENDED)
Current instruction: "Every number must have a source reference."
Strengthen to: "Every factual claim must start or end with its source: 'According to [Source N]' or '([Source N])'. No naked facts."

### 5.2 Confidence Signaling (RECOMMENDED)
Train the AI to express confidence levels:
- "✅ Confirmed by ≥2 sources: ..."
- "⚠️ Single source only: ..."
- "❓ Uncertain — sources conflict: ..."

### 5.3 "I Don't Know" Training (RECOMMENDED)
Add to system prompt: "If no source provides a specific number the user asks for, say 'I don't have a verified number for that from my sources' rather than estimating or using tangential data."

## 6. Quick Wins (Do First)

| # | Action | Impact | Effort |
|---|--------|--------|--------|
| 1 | Add cross-reference rule (§1.2) | High | Low |
| 2 | Add number validation post-process (§2.2) | High | Medium |
| 3 | "Don't translate numbers" rule (§3.2) | Medium | Low |
| 4 | Run Brave in both detected lang + "en" (§3.1) | Medium | Medium |
| 5 | Source age badges in UI (§1.3) | Medium | High (frontend) |
| 6 | Confidence signaling in prompts (§5.2) | Medium | Low |

## Summary

The platform already has strong foundations:
- ✅ Live-fetch for dynamic price pages
- ✅ Anti-hallucination number rules
- ✅ Multilingual keyword coverage
- ✅ Domain diversity caps
- ✅ Recency scoring with date extraction

The next layer is **validation and verification** — catching errors before they reach the user, not just hoping the prompt prevents them.
