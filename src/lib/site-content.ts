import { createClient } from "@/lib/supabase/server";

export type SiteContentBlock = {
  id: string;
  block_key: string;
  label: string;
  content_json: Record<string, unknown>;
  updated_at: string;
};

export const APPROVED_CONTENT_KEYS = [
  "hero",
  "strategic_priorities",
  "focus_areas",
  "footer",
  "homepage_mission",
  "homepage_energy_focus",
  "homepage_pipeline_highlight",
  "contact_cta",
  "ai_preview_text",
] as const;

export type ApprovedContentKey = (typeof APPROVED_CONTENT_KEYS)[number];

export async function getSiteContentByKey(
  blockKey: string
): Promise<SiteContentBlock | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .eq("block_key", blockKey)
    .single();

  if (error) return null;
  return data as SiteContentBlock;
}

export async function getApprovedSiteContent(): Promise<SiteContentBlock[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_content")
    .select("*")
    .in("block_key", APPROVED_CONTENT_KEYS)
    .order("block_key");

  if (error) return [];
  return data as SiteContentBlock[];
}
