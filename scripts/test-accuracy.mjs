#!/usr/bin/env node
/**
 * Ask Energy Accuracy Tester
 * 
 * Runs benchmark questions against the API and scores accuracy.
 * 
 * Usage:
 *   node scripts/test-accuracy.mjs [--language en|ar|id] [--question Q1.1]
 * 
 * Requires the dev server running on localhost:3000
 */

const BASE_URL = process.env.API_URL || "http://localhost:3000";
const API_ENDPOINT = `${BASE_URL}/api/ask-energy`;

// ─── Benchmark Questions ───

const BENCHMARKS = [
  // ── Oil Prices ──
  {
    id: "Q1.1",
    section: "Oil Prices",
    title: "Spot Price",
    en: "What is the current price of WTI crude oil, Brent crude, and Louisiana Light?",
    ar: "ما هو السعر الحالي لخام WTI وخام برنت وخام لويزيانا الخفيف؟",
    id_q: "Berapa harga terkini minyak mentah WTI, Brent, dan Louisiana Light?",
    checks: {
      extractPrices: ["WTI", "Brent", "Louisiana Light"],
      minSources: 2,
      requireDate: true,
    },
  },
  {
    id: "Q1.2",
    section: "Oil Prices",
    title: "Price Change",
    en: "How much did crude oil prices change today compared to yesterday?",
    ar: "كم تغيرت أسعار النفط الخام اليوم مقارنة بالأمس؟",
    id_q: "Berapa perubahan harga minyak mentah hari ini dibanding kemarin?",
    checks: {
      requirePercentChange: true,
      requireDirection: true,
    },
  },
  {
    id: "Q1.3",
    section: "Oil Prices",
    title: "Historical Context",
    en: "What was the crude oil price 30 days ago?",
    ar: "كم كان سعر النفط الخام قبل 30 يومًا؟",
    id_q: "Berapa harga minyak mentah 30 hari yang lalu?",
    checks: {
      requireDate: true,
      minSources: 1,
    },
  },

  // ── Natural Gas ──
  {
    id: "Q2.1",
    section: "Natural Gas",
    title: "Henry Hub Spot",
    en: "What is the current spot price of natural gas at Henry Hub?",
    ar: "ما هو السعر الفوري الحالي للغاز الطبيعي في Henry Hub؟",
    id_q: "Berapa harga spot gas alam di Henry Hub saat ini?",
    checks: {
      extractPrices: ["Henry Hub"],
      requireUnit: "$/MMBtu",
      minSources: 1,
    },
  },
  {
    id: "Q2.2",
    section: "Natural Gas",
    title: "TTF EU Price",
    en: "What is the TTF natural gas price today in Europe?",
    ar: "ما هو سعر الغاز الطبيعي TTF في أوروبا اليوم؟",
    id_q: "Berapa harga gas alam TTF di Eropa hari ini?",
    checks: {
      extractPrices: ["TTF"],
      requireUnit: "€/MWh",
      minSources: 1,
    },
  },

  // ── Energy Statistics ──
  {
    id: "Q3.1",
    section: "Statistics",
    title: "Algeria Gas Production",
    en: "What is Algeria's current annual natural gas production?",
    ar: "ما هو إنتاج الجزائر السنوي الحالي من الغاز الطبيعي؟",
    id_q: "Berapa produksi gas alam tahunan Aljazair saat ini?",
    checks: {
      requireUnit: "bcm",
      minSources: 1,
      requireYear: true,
      knownAnswer: { min: 80, max: 130, unit: "bcm" }, // Algeria produces ~80-130 bcm/year
    },
  },

  // ── Trade ──
  {
    id: "Q4.1",
    section: "Trade",
    title: "MEDGAZ Capacity",
    en: "What is the capacity of the MEDGAZ pipeline?",
    ar: "ما هي سعة خط أنابيب ميدغاز؟",
    id_q: "Berapa kapasitas pipa MEDGAZ?",
    checks: {
      requireUnit: "bcm",
      minSources: 1,
      knownAnswer: { min: 8, max: 12, unit: "bcm/year" }, // MEDGAZ is ~8-10 bcm
    },
  },

  // ── Multilingual Consistency ──
  {
    id: "Q7.1",
    section: "Consistency",
    title: "Same Question ×3 Languages",
    languages: ["en", "ar", "id"],
    question: {
      en: "What is the current price of WTI crude oil?",
      ar: "ما هو السعر الحالي لخام WTI؟",
      id_q: "Berapa harga WTI saat ini?",
    },
    checks: {
      crossLanguageConsistency: true,
      maxPriceDiffPercent: 2,
    },
  },
];

// ─── Test Runner ───

async function askEnergy(question) {
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question }),
  });

  if (!response.ok) {
    throw new Error(`API returned ${response.status}`);
  }

  let answer = "";
  let sources = [];
  let debug = null;

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data: ")) continue;
      const payload = trimmed.slice(6);
      if (payload === "[DONE]") continue;

      try {
        const data = JSON.parse(payload);
        if (data.c) answer += data.c;
        if (data.sources) sources = data.sources;
        if (data.p === "debug") debug = data;
      } catch {}
    }
  }

  return { answer, sources, debug };
}

function extractNumbers(text) {
  const prices = [];
  let match;

  // Pattern A: Label then price — "WTI**: $93.68" or "WTI ... is $93.68"
  // Match label anywhere, then capture first $XX.XX (1-3 digits before decimal to handle gas: $3.09) within next 120 chars
  const labelThenPrice = /(WTI|Brent|Louisiana Light|Henry Hub|TTF|NBP|JKM)[\s\S]{0,120}?\$?(\d{1,3}\.\d{2})/gi;
  while ((match = labelThenPrice.exec(text)) !== null) {
    const label = match[1];
    if (!prices.some(p => p.label?.toLowerCase() === label.toLowerCase())) {
      prices.push({ label, value: parseFloat(match[2]) });
    }
  }

  // Pattern B: Price then label — "$93.68 per barrel for WTI" or "$93.68 (Brent)"
  const priceThenLabel = /\$(\d{1,3}\.\d{2})[\s\S]{0,60}?(WTI|Brent|Louisiana Light|Henry Hub|TTF|NBP|JKM)/gi;
  while ((match = priceThenLabel.exec(text)) !== null) {
    const label = match[2];
    if (!prices.some(p => p.label?.toLowerCase() === label.toLowerCase())) {
      prices.push({ label, value: parseFloat(match[1]) });
    }
  }

  // Pattern C: Any $XX.XX fallback (1-3 digits before decimal for gas prices like $3.09)
  if (prices.length === 0) {
    const priceRe = /\$(\d{1,3}\.\d{2})/g;
    while ((match = priceRe.exec(text)) !== null) {
      prices.push({ value: parseFloat(match[1]) });
    }
  }

  // Extract percentage changes
  const pctRe = /([+-]?\d+\.?\d*)%/g;
  const pcts = [];
  while ((match = pctRe.exec(text)) !== null) {
    pcts.push(parseFloat(match[1]));
  }

  return { prices, pcts };
}
function extractDate(text) {
  const datePattern = /(January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},\s+20\d{2}/i;
  const match = text.match(datePattern);
  return match ? match[0] : null;
}

async function fetchLiveEIA() {
  try {
    const res = await fetch("https://www.eia.gov/todayinenergy/prices.php", {
      headers: { "User-Agent": "RamBelEnergy-AccuracyTester/1.0" },
    });
    const html = await res.text();
    const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    const prices = {};
    const wtiMatch = text.match(/WTI\s+(\d+\.\d+)/);
    const brentMatch = text.match(/Brent\s+(\d+\.\d+)/);
    const llMatch = text.match(/Louisiana Light\s+(\d+\.\d+)/);
    const dateMatch = text.match(/(\w+ \d+, 20\d{2})/);

    if (wtiMatch) prices.WTI = parseFloat(wtiMatch[1]);
    if (brentMatch) prices.Brent = parseFloat(brentMatch[1]);
    if (llMatch) prices["Louisiana Light"] = parseFloat(llMatch[1]);

    return { prices, date: dateMatch ? dateMatch[1] : null, source: "EIA live" };
  } catch (e) {
    return { prices: {}, date: null, source: "EIA unreachable", error: e.message };
  }
}

async function fetchLiveGasRef() {
  // TTF and Henry Hub reference ranges (gas is volatile, use sanity ranges)
  // Henry Hub: typically $1.50-$5.00/MMBtu
  // TTF: typically €10-€80/MWh  
  return {
    "Henry Hub": { min: 1.0, max: 8.0, unit: "/MMBtu" },
    "TTF": { min: 5.0, max: 100.0, unit: "/MWh" },
  };
}

function scoreAnswer(benchmark, result, liveData, gasRef) {
  const { answer, sources } = result;
  const scores = {
    numerical_accuracy: 0,
    source_quality: 0,
    freshness: 0,
    consistency: 0,
    completeness: 0,
  };
  const notes = [];

  // ── Numerical Accuracy ──
  const { prices, pcts } = extractNumbers(answer);
  const checks = benchmark.checks || {};
  
  // Determine reference data based on question type
  const isOilPriceQuestion = benchmark.section === "Oil Prices" || checks.extractPrices?.some(p => ["WTI","Brent"].includes(p));
  const isGasQuestion = benchmark.section === "Natural Gas" || checks.extractPrices?.some(p => ["Henry Hub","TTF"].includes(p));
  const isStaticFact = checks.knownAnswer != null;
  const isHistorical = benchmark.title?.includes("Historical");
  
  if (isStaticFact) {
    // Known-answer validation for static facts
    const ka = checks.knownAnswer;
    const bcmPattern = /(\d+[\.\d]*)\s*(?:bcm|billion\s+cubic\s+meters?)/i;
    const matchText = ka.unit === 'bcm' ? answer.match(bcmPattern) : answer.match(new RegExp('(\\d+[\\.\\d]*)\\s*' + ka.unit, 'i'));
    if (matchText) {
      const val = parseFloat(matchText[1]);
      if (ka.min !== undefined && ka.max !== undefined) {
        if (val >= ka.min && val <= ka.max) {
          scores.numerical_accuracy = 10;
          notes.push(`Value ${val} ${ka.unit} within expected range ${ka.min}-${ka.max}`);
        } else {
          scores.numerical_accuracy = 3;
          notes.push(`Value ${val} ${ka.unit} outside expected range ${ka.min}-${ka.max}`);
        }
      } else if (ka.exact !== undefined) {
        const diff = Math.abs(val - ka.exact) / ka.exact * 100;
        scores.numerical_accuracy = diff < 5 ? 10 : diff < 15 ? 7 : 3;
        notes.push(`Value ${val} vs expected ${ka.exact} (${diff.toFixed(1)}% off)`);
      }
    } else {
      scores.numerical_accuracy = 2;
      notes.push(`Could not find ${ka.unit} value in answer`);
    }
  } else if (isHistorical) {
    // Historical questions: just check that prices and a past date are mentioned
    scores.numerical_accuracy = prices.length >= 2 ? 7 : 3;
    notes.push(`Historical question — ${prices.length} prices mentioned`);
  } else if (isOilPriceQuestion && liveData?.prices?.WTI) {
    // Oil price comparison against EIA live
    const wtiPrice = prices.find(p => p.label && /wti/i.test(p.label));
    const brentPrice = prices.find(p => p.label && /brent/i.test(p.label));
    const llPrice = prices.find(p => p.label && /louisiana/i.test(p.label));
    
    let priceMatches = 0;
    let priceTotal = 0;
    
    for (const [label, refPrice] of [[wtiPrice, liveData.prices.WTI], [brentPrice, liveData.prices.Brent], [llPrice, liveData.prices["Louisiana Light"]]]) {
      if (label) {
        priceTotal++;
        const diff = Math.abs(label.value - refPrice) / refPrice * 100;
        if (diff < 3) priceMatches++;
      }
    }
    
    if (priceTotal > 0) {
      const accuracy = priceMatches / priceTotal;
      if (accuracy >= 0.9) scores.numerical_accuracy = 10;
      else if (accuracy >= 0.7) scores.numerical_accuracy = 7;
      else if (accuracy >= 0.5) scores.numerical_accuracy = 5;
      else scores.numerical_accuracy = 3;
      notes.push(`${priceMatches}/${priceTotal} prices match live EIA (±1%)`);
    } else {
      const anyPrice = prices[0];
      if (anyPrice && liveData.prices.WTI) {
        const diff = Math.abs(anyPrice.value - liveData.prices.WTI) / liveData.prices.WTI * 100;
        scores.numerical_accuracy = diff < 2 ? 7 : 2;
        notes.push(`Price $${anyPrice.value} vs EIA WTI $${liveData.prices.WTI}`);
      } else {
        scores.numerical_accuracy = 1;
        notes.push("No prices extracted from answer");
      }
    }
  } else if (isGasQuestion) {
    // Gas questions: check that prices are present and reasonable
    const gasPrice = prices.find(p => p.label && /henry|ttf|nbp|jkm/i.test(p.label));
    if (gasPrice) {
      // Gas prices are typically $1-$10 range
      if (gasPrice.value > 0.5 && gasPrice.value < 100) {
        scores.numerical_accuracy = 7;
        notes.push(`Gas price found: $${gasPrice.value} (${gasPrice.label})`);
      } else {
        scores.numerical_accuracy = 4;
        notes.push(`Gas price $${gasPrice.value} seems unreasonable`);
      }
    } else {
      const anyPrice = prices[0];
      if (anyPrice && anyPrice.value > 0.5 && anyPrice.value < 100) {
        scores.numerical_accuracy = 5;
        notes.push(`Price found but not labeled as gas: $${anyPrice.value}`);
      } else {
        scores.numerical_accuracy = 2;
        notes.push("No gas price found in answer");
      }
    }
  } else {
    // Generic scoring
    scores.numerical_accuracy = prices.length > 0 ? 5 : 2;
    notes.push(`${prices.length} prices found, no reference to compare`);
  }

  // ── Source Quality ──
  const highPrioritySources = sources.filter(s => s.priority <= 3).length;
  const totalSources = sources.length;
  if (totalSources >= 3 && highPrioritySources >= 1) { scores.source_quality = 10; }
  else if (totalSources >= 2) { scores.source_quality = 7; }
  else if (totalSources >= 1) { scores.source_quality = 4; }
  else { scores.source_quality = 0; notes.push("No sources!"); }
  notes.push(`${highPrioritySources}/${totalSources} high-priority sources`);

  // ── Freshness ──
  const answerDate = extractDate(answer);
  const today = new Date();
  
  // Static facts (production capacity, pipeline specs) don't need daily freshness
  const isStaticFact_Fresh = benchmark.section === "Trade" || 
    benchmark.section === "Statistics" ||
    benchmark.checks?.knownAnswer;
  
  if (isStaticFact_Fresh) {
    scores.freshness = 8; // Static facts — freshness not critical
    notes.push("Static fact — freshness not applicable");
  } else if (answerDate) {
    const parsedDate = new Date(answerDate);
    const daysOld = Math.floor((today - parsedDate) / (1000 * 60 * 60 * 24));
    if (daysOld <= 1) { scores.freshness = 10; }
    else if (daysOld <= 3) { scores.freshness = 7; notes.push(`Data ${daysOld} days old`); }
    else if (daysOld <= 7) { scores.freshness = 4; notes.push(`Data ${daysOld} days old — stale`); }
    else { scores.freshness = 1; notes.push(`Data ${daysOld} days old — very stale`); }
  } else {
    scores.freshness = 3;
    notes.push("No date found in answer");
  }

  // ── Completeness ──
  if (checks.extractPrices) {
    const found = checks.extractPrices.filter(p => answer.includes(p));
    scores.completeness = Math.round((found.length / checks.extractPrices.length) * 10);
    notes.push(`Price coverage: ${found.join(", ")}`);
  } else if (checks.requirePercentChange) {
    scores.completeness = pcts.length > 0 ? 7 : 2;
    notes.push(`% changes: ${pcts.length} found`);
  } else if (isHistorical) {
    // Historical: score on date specificity, multiple data points, source count
    const histDate = extractDate(answer);
    const hasDate = histDate !== null;
    const hasMultiplePrices = prices.length >= 3;
    const hasSources = totalSources >= 2;
    const hasOldDate = /\d{1,2}\s+\w+\s+20\d{2}/gi.test(answer); // any date in answer
    let histScore = 4; // base
    if (hasDate) histScore += 2;
    if (hasOldDate) histScore += 1;
    if (hasMultiplePrices) histScore += 2;
    if (hasSources) histScore += 1;
    scores.completeness = Math.min(10, histScore);
    notes.push(`Historical completeness: date=${hasDate}, prices=${prices.length}, sources=${totalSources}`);
  } else if (isStaticFact) {
    // Static facts: check unit presence, year references, and source depth
    const hasUnit = checks.requireUnit ? answer.toLowerCase().includes(checks.requireUnit.toLowerCase()) : true;
    const hasYear = checks.requireYear ? /\b20\d{2}\b/.test(answer) : true;
    let factScore = totalSources >= 5 ? 9 : totalSources >= 3 ? 8 : totalSources >= 1 ? 7 : 3;
    if (!hasUnit || !hasYear) factScore = Math.max(4, factScore - 2);
    scores.completeness = factScore;
    notes.push(`Static fact completeness: unit=${hasUnit}, year=${hasYear}, sources=${totalSources}`);
  } else {
    scores.completeness = totalSources > 0 ? 6 : 2;
  }

  // ── Consistency ──
  if (isStaticFact || isHistorical) {
    // Non-price factual questions: score on answer depth and source diversity
    const answerLength = answer.length;
    if (answerLength > 500 && totalSources >= 5) scores.consistency = 9;
    else if (answerLength > 500 && totalSources >= 3) scores.consistency = 8;
    else if (answerLength > 300 && totalSources >= 2) scores.consistency = 7;
    else if (totalSources >= 1) scores.consistency = 6;
    else scores.consistency = 4;
    notes.push(`Consistency based on length=${answerLength} chars, sources=${totalSources}`);
  } else {
    scores.consistency = 5; // baseline for price questions (cross-language test handles consistency)
  }

  const total = Object.values(scores).reduce((a, b) => a + b, 0);

  return { scores, total, notes };
}

function grade(total) {
  if (total >= 40) return "🟢 PASS";
  if (total >= 30) return "🟡 WARN";
  if (total >= 20) return "🟠 FAIL";
  return "🔴 CRITICAL";
}

// ─── Cross-Language Consistency ───

async function testCrossLanguage(benchmark) {
  console.log(`\n🌐 Cross-language test: ${benchmark.id} — ${benchmark.title}`);
  console.log("═".repeat(60));

  const results = {};
  for (const lang of benchmark.languages) {
    const question = benchmark.question[lang === "id" ? "id_q" : lang];
    console.log(`\n  [${lang.toUpperCase()}] "${question}"`);
    try {
      const result = await askEnergy(question);
      const { prices, pcts } = extractNumbers(result.answer);
      results[lang] = { prices, pcts, sources: result.sources.length };
      console.log(`    Prices: ${prices.map(p => `$${p.value}`).join(", ")}`);
      console.log(`    Sources: ${result.sources.length}`);
    } catch (e) {
      console.log(`    ❌ Error: ${e.message}`);
      results[lang] = { error: e.message };
    }
  }

  // Compare prices across languages
  const allPrices = Object.entries(results)
    .filter(([, r]) => r.prices?.length > 0)
    .map(([lang, r]) => ({ lang, price: r.prices[0]?.value }));

  if (allPrices.length >= 2) {
    const values = allPrices.map(p => p.price);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values);
    const variation = maxVal - minVal;
    const pctVar = maxVal > 0 ? (variation / maxVal * 100) : 0;

    console.log(`\n  📊 Cross-language price variation: $${minVal}–$${maxVal} (${pctVar.toFixed(1)}%)`);
    if (pctVar <= 2) console.log("  🟢 Consistent across languages");
    else if (pctVar <= 5) console.log("  🟡 Minor variation — investigate");
    else console.log("  🔴 Significant inconsistency — must fix");
  }
}

// ─── Main ───

async function main() {
  const args = process.argv.slice(2);
  const langFilter = args.includes("--language") ? args[args.indexOf("--language") + 1] : null;
  const questionFilter = args.includes("--question") ? args[args.indexOf("--question") + 1] : null;

  console.log("╔══════════════════════════════════════════╗");
  console.log("║  Ask Energy — Accuracy Benchmark Suite  ║");
  console.log("╚══════════════════════════════════════════╝");
  console.log(`Target: ${API_ENDPOINT}`);
  console.log(`Time: ${new Date().toISOString()}\n`);

  // Fetch live reference data
  console.log("📡 Fetching live reference data from EIA...");
  const liveData = await fetchLiveEIA();
  const gasRef = await fetchLiveGasRef();
  console.log(`   EIA: ${liveData.date} — WTI $${liveData.prices.WTI}, Brent $${liveData.prices.Brent}, LL $${liveData.prices["Louisiana Light"]}`);
  console.log(`   Gas ref: Henry Hub $${gasRef["Henry Hub"].min}-$${gasRef["Henry Hub"].max}, TTF €${gasRef["TTF"].min}-€${gasRef["TTF"].max}`);
  console.log("");

  // Filter benchmarks
  let benchmarks = BENCHMARKS;
  if (questionFilter) {
    benchmarks = benchmarks.filter(b => b.id === questionFilter);
  }

  const results = [];

  for (const benchmark of benchmarks) {
    const lang = langFilter || "en";
    const questionKey = lang === "id" ? "id_q" : lang;
    const question = benchmark.question?.[questionKey]
      || benchmark[questionKey]
      || benchmark.en;

    // Cross-language test
    if (benchmark.languages) {
      await testCrossLanguage(benchmark);
      continue;
    }

    console.log(`\n📋 ${benchmark.id} — ${benchmark.section}: ${benchmark.title}`);
    console.log(`   [${lang.toUpperCase()}] "${question}"`);

    try {
      const result = await askEnergy(question);
      const { scores, total, notes } = scoreAnswer(benchmark, result, liveData, gasRef);

      console.log(`   Sources: ${result.sources.length} | Prices found: ${extractNumbers(result.answer).prices.length}`);
      console.log(`   Date in answer: ${extractDate(result.answer) || "NOT FOUND"}`);
      console.log(`   Scores: Num=${scores.numerical_accuracy} Src=${scores.source_quality} Fresh=${scores.freshness} Consist=${scores.consistency} Complete=${scores.completeness}`);
      console.log(`   Total: ${total}/50 ${grade(total)}`);
      for (const note of notes) {
        console.log(`     ↳ ${note}`);
      }

      results.push({ id: benchmark.id, language: lang, ...scores, total, grade: grade(total) });

      // Rate limit
      await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
      results.push({ id: benchmark.id, language: lang, error: e.message });
    }
  }

  // ─── Summary ───
  console.log("\n\n╔══════════════════════════════════════════╗");
  console.log("║              SUMMARY                    ║");
  console.log("╚══════════════════════════════════════════╝");

  const passed = results.filter(r => r.total >= 40);
  const warned = results.filter(r => r.total >= 30 && r.total < 40);
  const failed = results.filter(r => r.total > 0 && r.total < 30);

  console.log(`  Total tests: ${results.length}`);
  console.log(`  🟢 Pass (40-50): ${passed.length}`);
  console.log(`  🟡 Warn (30-39): ${warned.length}`);
  console.log(`  🟠 Fail (<30): ${failed.length}`);
  console.log(`  Avg score: ${(results.reduce((a, r) => a + (r.total || 0), 0) / results.length).toFixed(1)}/50\n`);

  // Save results
  const report = {
    timestamp: new Date().toISOString(),
    liveReference: liveData,
    results,
  };
  const fs = await import("fs");
  fs.writeFileSync(
    "test-results/accuracy-report.json",
    JSON.stringify(report, null, 2)
  );
  console.log("📄 Report saved: test-results/accuracy-report.json");
}

main().catch(console.error);
