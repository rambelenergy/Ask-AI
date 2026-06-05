/**
 * Embedding utility using OpenAI text-embedding-3-small.
 *
 * Used to re-rank trusted search results by semantic similarity to the user question,
 * improving result quality beyond simple priority-group sorting.
 *
 * Model: text-embedding-3-small (default)
 * Produces 1536-dimensional normalized embeddings.
 */

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

/**
 * Embed the question and each result's text, then return results sorted
 * by cosine similarity (most relevant first). Falls back to original order
 * if embedding fails.
 */
export async function rerankByEmbedding<T extends { title: string; snippet?: string; summary?: string }>(
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

  // Compute similarity scores
  const scored = results.map((r, i) => ({
    result: r,
    score: resultEmbeddings[i] ? cosineSimilarity(questionEmbedding, resultEmbeddings[i]) : 0,
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  return scored.map((s) => s.result);
}
