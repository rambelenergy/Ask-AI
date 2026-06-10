/**
 * Embedding utility using OpenAI text-embedding-3-small.
 *
 * Used to re-rank trusted search results by semantic similarity to the user question,
 * with a priority-group weighting multiplier to ensure higher-priority sources
 * (Algerian official, European institutions, international organizations) are
 * favored over lower-priority sources (news agencies, general media).
 *
 * Model: text-embedding-3-small (default)
 * Produces 1536-dimensional normalized embeddings.
 */

/**
 * Priority weight multiplier per priority group.
 * Higher-priority sources get a stronger boost in semantic ranking.
 *
 * Priority 1 (Algerian official):    1.25x boost
 * Priority 2 (European institutions): 1.20x boost
 * Priority 3 (International orgs):    1.15x boost
 * Priority 4 (News agencies):         1.00x (neutral)
 * Priority 5 (Other media/analytical):0.90x (slight penalty)
 */
const PRIORITY_WEIGHT: Record<number, number> = {
  1: 1.25,
  2: 1.20,
  3: 1.15,
  4: 1.00,
  5: 0.90,
};

function getEmbeddingModel(): string {
  return process.env.OPENAI_EMBEDDING_MODEL ?? "text-embedding-3-small";
}

/**
 * Get a single embedding vector for a text.
 * Returns null if the API is unavailable.
 */
export async function embedText(text: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

  if (!apiKey) return null;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8_000);

  try {
    const response = await fetch(`${baseUrl}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: getEmbeddingModel(),
        input: text.slice(0, 2048), // reasonable truncation
      }),
      signal: controller.signal,
    });

    if (!response.ok) return null;

    const data = await response.json();
    const vector = data.data?.[0]?.embedding;

    if (!Array.isArray(vector) || vector.length === 0) return null;

    return vector;
  } catch {
    return null;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : dot / denom;
}

export interface RankableResult {
  title: string;
  snippet?: string;
  summary?: string;
  priority?: number;
}

/**
 * Embed the question and each result's text, then return results sorted
 * by a combined score: (cosineSimilarity * priorityWeight).
 *
 * Higher-priority institutional sources get a score multiplier, preventing
 * news agencies and general media from dominating purely on semantic match.
 *
 * Falls back to original order if embedding fails.
 */
export async function rerankByEmbedding<T extends RankableResult>(
  question: string,
  results: T[]
): Promise<T[]> {
  if (results.length <= 1) return results;

  const questionEmbedding = await embedText(question);
  if (!questionEmbedding) return results; // fallback: keep original order

  // Create text representations for each result
  const texts = results.map((r) => {
    const body = r.summary ?? r.snippet ?? r.title;
    return `${r.title} ${body}`.slice(0, 2048);
  });

  // Embed all result texts in parallel
  const embeddingPromises = texts.map((t) => embedText(t));
  const resultEmbeddings = await Promise.all(embeddingPromises);

  // Compute combined scores: semantic similarity × priority weight
  const scored = results.map((r, i) => {
    const semanticScore = resultEmbeddings[i]
      ? cosineSimilarity(questionEmbedding, resultEmbeddings[i])
      : 0;
    const priority = r.priority ?? 5;
    const weight = PRIORITY_WEIGHT[priority] ?? 1.0;
    return {
      result: r,
      // Combined score with priority weighting
      score: semanticScore * weight,
    };
  });

  // Sort by combined score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.map((s) => s.result);
}
