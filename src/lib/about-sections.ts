import { createClient } from "@/lib/supabase/server";

export type AboutSection = {
  id: string;
  section_key: string;
  label: string;
  content_json: Record<string, unknown>;
  sort_order: number;
};

export async function getAboutSectionByKey(
  sectionKey: string
): Promise<AboutSection | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_sections")
    .select("*")
    .eq("section_key", sectionKey)
    .single();

  if (error) return null;
  return data as AboutSection;
}

export async function getAllAboutSections(): Promise<AboutSection[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("about_sections")
    .select("*")
    .order("sort_order");

  if (error) return [];
  return (data || []) as AboutSection[];
}
