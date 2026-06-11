# Ask Energy — Accuracy Benchmark Suite

> Version: 1.0 | Created: 2026-06-11
> Purpose: Systematic accuracy testing for RamBelEnergy Ask Energy platform

## How to Use

Run each question in English, Arabic, and Indonesian. Compare:
1. **Numerical accuracy** — do numbers match live sources?
2. **Source quality** — are sources authoritative (P1-P3)?
3. **Consistency** — does the answer stay consistent across languages?
4. **Freshness** — is data current (within tolerance)?
5. **Completeness** — does the answer cover the question fully?

### Scoring
Each answer scores 0-10 per dimension. Total: 0-50.
- **40-50**: Production-ready
- **30-39**: Needs improvement
- **20-29**: Requires fixes before release
- **0-19**: Unacceptable

---

## Section 1: Oil Prices

### Q1.1 — Spot Price
**EN:** "What is the current price of WTI crude oil, Brent crude, and Louisiana Light?"
**AR:** "ما هو السعر الحالي لخام WTI وخام برنت وخام لويزيانا الخفيف؟"
**ID:** "Berapa harga terkini minyak mentah WTI, Brent, dan Louisiana Light?"

| Dimension | Target | Tolerance |
|-----------|--------|-----------|
| WTI price | Exact match to EIA live | ±1% |
| Brent price | Exact match to EIA live | ±1% |
| LL price | Exact match to EIA live | ±1% |
| Date | Today or last close | Must state the data date |
| Sources | ≥2 (EIA + 1 other) | Minimum 2 unique domains |

### Q1.2 — Price Change
**EN:** "How much did crude oil prices change today compared to yesterday?"
**AR:** "كم تغيرت أسعار النفط الخام اليوم مقارنة بالأمس؟"
**ID:** "Berapa perubahan harga minyak mentah hari ini dibanding kemarin?"

| Dimension | Target | Tolerance |
|-----------|--------|-----------|
| Change % | Match source | ±0.2% |
| Direction | Correct (up/down) | Must be right |
| Time reference | States comparison period | "from previous close" |

### Q1.3 — Historical Context
**EN:** "What was the crude oil price 30 days ago?"
**AR:** "كم كان سعر النفط الخام قبل 30 يومًا؟"
**ID:** "Berapa harga minyak mentah 30 hari yang lalu?"

| Dimension | Target | Tolerance |
|-----------|--------|-----------|
| Price | Historically accurate | ±2% |
| Date stated | Specifies the exact date | Must mention date |

---

## Section 2: Natural Gas Prices

### Q2.1 — Spot Price
**EN:** "What is the current spot price of natural gas at Henry Hub?"
**AR:** "ما هو السعر الفوري الحالي للغاز الطبيعي في Henry Hub؟"
**ID:** "Berapa harga spot gas alam di Henry Hub saat ini?"

| Dimension | Target | Tolerance |
|-----------|--------|-----------|
| Price | Exact match to EIA | ±2% |
| Unit | $/MMBtu | Must specify |
| Sources | ≥1 | EIA or equivalent |

### Q2.2 — EU Gas Prices
**EN:** "What is the TTF natural gas price today in Europe?"
**AR:** "ما هو سعر الغاز الطبيعي TTF في أوروبا اليوم؟"
**ID:** "Berapa harga gas alam TTF di Eropa hari ini?"

| Dimension | Target | Tolerance |
|-----------|--------|-----------|
| Price | Match market data | ±3% |
| Unit | €/MWh | Must specify |
| Date | Today or last trade | Must state |

---

## Section 3: Energy Statistics

### Q3.1 — Production Figures
**EN:** "What is Algeria's current annual natural gas production?"
**AR:** "ما هو إنتاج الجزائر السنوي الحالي من الغاز الطبيعي؟"
**ID:** "Berapa produksi gas alam tahunan Aljazair saat ini?"

| Dimension | Target | Tolerance |
|-----------|--------|-----------|
| Production | Match IEA/OPEC data | ±5% |
| Unit | bcm/year | Must specify |
| Sources | ≥1 (P1-P4) | Government/institutional |
| Year | States the data year | If not current year, warns |

### Q3.2 — Export Data
**EN:** "How much natural gas does Algeria export to Italy?"
**AR:** "كم تصدر الجزائر من الغاز الطبيعي إلى إيطاليا؟"
**ID:** "Berapa banyak gas alam yang diekspor Aljazair ke Italia?"

| Dimension | Target | Tolerance |
|-----------|--------|-----------|
| Volume | Match official data | ±10% |
| Sources | ≥1 Algerian or Italian gov | P1-P3 only |
| Year | States data year | Must be clear |

---

## Section 4: Algeria-Europe Energy Trade

### Q4.1 — Pipeline Capacity
**EN:** "What is the capacity of the MEDGAZ pipeline?"
**AR:** "ما هي سعة خط أنابيب ميدغاز؟"
**ID:** "Berapa kapasitas pipa MEDGAZ?"

| Dimension | Target | Tolerance |
|-----------|--------|-----------|
| Capacity | Match official specs | ±5% |
| Unit | bcm/year | Must specify |
| Sources | MEDGAZ official or Sonatrach | P1-P2 |

### Q4.2 — Trade Relationship
**EN:** "Describe the Algeria-Italy energy cooperation"
**AR:** "صف التعاون في مجال الطاقة بين الجزائر وإيطاليا"
**ID:** "Jelaskan kerja sama energi Aljazair-Italia"

| Dimension | Target | Tolerance |
|-----------|--------|-----------|
| Key facts | Sonatrach-ENI, pipelines | Factual |
| Sources | ≥2 (both countries) | Balanced |
| Recent data | Mentions current/recent | ≤1 year old |

---

## Section 5: Production & Export Figures

### Q5.1 — Sonatrach Production
**EN:** "What is Sonatrach's current oil and gas production?"
**AR:** "ما هو إنتاج سوناطراك الحالي من النفط والغاز؟"
**ID:** "Berapa produksi minyak dan gas Sonatrach saat ini?"

| Dimension | Target | Tolerance |
|-----------|--------|-----------|
| Oil production | Match Sonatrach data | ±10% |
| Gas production | Match Sonatrach data | ±10% |
| Sources | Sonatrach official | P1-P2 |

---

## Section 6: Financial & Market

### Q6.1 — Energy Investment
**EN:** "What is the current investment in Algerian renewable energy?"
**AR:** "ما هو الاستثمار الحالي في الطاقة المتجددة الجزائرية؟"
**ID:** "Berapa investasi energi terbarukan Aljazair saat ini?"

| Dimension | Target | Tolerance |
|-----------|--------|-----------|
| Investment | Match official data | ±15% |
| Sources | ≥1 institutional | P1-P4 |
| Year stated | Clearly indicated | Must state |

### Q6.2 — Price Forecast
**EN:** "What is the outlook for oil prices in the next quarter?"
**AR:** "ما هي توقعات أسعار النفط في الربع القادم؟"
**ID:** "Bagaimana prospek harga minyak untuk kuartal depan?"

| Dimension | Target | Tolerance |
|-----------|--------|-----------|
| Multiple sources | ≥3 cited | Must credit |
| Attribution | "According to [Source]" | Every prediction |
| Uncertainty | Notes it's a forecast | Must include caveat |
| No fabricated numbers | All numbers from sources | Absolute |

---

## Section 7: Multilingual Consistency

### Q7.1 — Same Question, Three Languages
Test Q1.1 in EN, AR, ID simultaneously.

| Dimension | Target |
|-----------|--------|
| Price numbers identical | Same WTI/Brent/LL across all 3 |
| Date identical | Same "as of" date |
| Source count similar | ±1 source difference max |
| No language-only hallucinations | AR answer doesn't invent extra data |

### Q7.2 — Translation Fidelity
**EN:** "What are the top 3 energy exports from Algeria?"
**AR:** "ما هي أهم 3 صادرات طاقة من الجزائر؟"
**ID:** "Apa 3 ekspor energi utama Aljazair?"

| Dimension | Target |
|-----------|--------|
| Same top 3 | Identical ranking across languages |
| Same units | bcm, TWh, etc. consistent |
| Same sources | Source overlap ≥50% |

---

## Automated Scoring Template

```json
{
  "question": "Q1.1",
  "language": "EN",
  "scores": {
    "numerical_accuracy": 0,
    "source_quality": 0,
    "consistency": 0,
    "freshness": 0,
    "completeness": 0
  },
  "total": 0,
  "notes": ""
}
```
