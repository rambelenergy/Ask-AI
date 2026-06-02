import { createClient } from "@/lib/supabase/server";
import type { Publication } from "@/types/publication";

export async function getPublicationCount(): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("publications")
    .select("*", { count: "exact", head: true });

  return count ?? 0;
}

export async function getPublications(): Promise<Publication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;
  return data as Publication[];
}

export async function getPublicationById(id: string): Promise<Publication | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Publication;
}

export async function getPublicationBySlug(slug: string): Promise<Publication | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) return null;
  return data as Publication;
}

export async function getPublishedPublications(): Promise<Publication[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;
  return data as Publication[];
}

export async function getFeaturedPublication(): Promise<Publication | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as Publication;
}

export async function getPublicationTypes(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select("pub_type")
    .eq("status", "published")
    .not("pub_type", "is", null);

  if (error) throw error;
  const types = data.map((r) => r.pub_type as string).filter(Boolean);
  return [...new Set(types)].sort();
}

export async function getPublicationCategories(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select("category")
    .eq("status", "published")
    .not("category", "is", null);

  if (error) throw error;
  const categories = data.map((r) => r.category as string).filter(Boolean);
  return [...new Set(categories)].sort();
}

export async function getPublicationRegions(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("publications")
    .select("region")
    .eq("status", "published")
    .not("region", "is", null);

  if (error) throw error;
  const regions = data.map((r) => r.region as string).filter(Boolean);
  return [...new Set(regions)].sort();
}

export async function getRelatedPublications(
  excludeSlug: string,
  category: string | null,
  limit = 3
): Promise<Publication[]> {
  const supabase = await createClient();
  let query = supabase
    .from("publications")
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
  return data as Publication[];
}
