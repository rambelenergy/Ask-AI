"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAuth() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/admin/login");
  }
  return user;
}

export async function updateProfileSummarize(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();

    const summarize = formData.get("summarize") as string;

    if (!summarize.trim()) {
      return { success: false, error: "Summarize text cannot be empty." };
    }

    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("about_sections")
      .select("content_json")
      .eq("section_key", "profile")
      .single();

    const updatedJson = {
      ...((existing?.content_json as Record<string, unknown>) || {}),
      summarize: summarize.trim(),
    };

    const { error } = await supabase
      .from("about_sections")
      .upsert(
        {
          section_key: "profile",
          label: "Profile Section",
          content_json: updatedJson,
          sort_order: 2,
        },
        { onConflict: "section_key" }
      );

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/content");
    revalidatePath("/");
    revalidatePath("/about");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}

export async function updateAboutSection(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();

    const sectionKey = formData.get("section_key") as string;
    const contentRaw = formData.get("content_json") as string;

    if (!sectionKey) {
      return { success: false, error: "Section key is required." };
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(contentRaw);
    } catch {
      return { success: false, error: "Invalid JSON in content field." };
    }

    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("about_sections")
      .select("label, sort_order")
      .eq("section_key", sectionKey)
      .single();

    const { error } = await supabase
      .from("about_sections")
      .upsert(
        {
          section_key: sectionKey,
          label: existing?.label || sectionKey,
          content_json: parsed,
          sort_order: existing?.sort_order ?? 0,
        },
        { onConflict: "section_key" }
      );

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/about");
    revalidatePath("/about");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}
