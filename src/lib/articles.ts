import { createClient } from "@/lib/supabase/server";
import type { Article } from "@/types/article";

export async function getArticleCounts(): Promise<{
  total: number;
  published: number;
  drafts: number;
}> {
  const supabase = await createClient();

  const { count: total } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true });

  const { count: published } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("status", "published");

  const { count: drafts } = await supabase
    .from("articles")
    .select("*", { count: "exact", head: true })
    .eq("status", "draft");

  return {
    total: total ?? 0,
    published: published ?? 0,
    drafts: drafts ?? 0,
  };
}

export async function getArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Article[];
}

export async function getArticleById(id: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Article;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data as Article;
}

export async function getPublishedArticles(): Promise<Article[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data as Article[];
}

export async function getFeaturedArticle(): Promise<Article | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as Article;
}

export async function getArticleCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("articles")
    .select("category")
    .eq("status", "published")
    .not("category", "is", null);

  if (error) throw error;
  const categories = data
    .map((r) => r.category as string)
    .filter(Boolean);
  return [...new Set(categories)].sort();
}

export async function getRelatedArticles(
  excludeSlug: string,
  category: string | null,
  limit = 3
): Promise<Article[]> {
  const supabase = await createClient();
  let query = supabase
    .from("articles")
    .select("*")
    .eq("status", "published")
    .neq("slug", excludeSlug)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;
  if (error) return [];
  return data as Article[];
}
