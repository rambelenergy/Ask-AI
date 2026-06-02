"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { APPROVED_CONTENT_KEYS } from "@/lib/site-content";

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

export async function updateSiteContent(
  _prevState: unknown,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAuth();

    const blockKey = formData.get("block_key") as string;
    const content = formData.get("content") as string;

    if (!APPROVED_CONTENT_KEYS.includes(blockKey as typeof APPROVED_CONTENT_KEYS[number])) {
      return { success: false, error: "Invalid content key." };
    }

    if (!content.trim()) {
      return { success: false, error: "Content cannot be empty." };
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return { success: false, error: "Invalid JSON format." };
    }

    const supabase = await createClient();

    const { error } = await supabase
      .from("site_content")
      .upsert(
        {
          block_key: blockKey,
          label: blockKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          content_json: parsed,
        },
        { onConflict: "block_key" }
      );

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/content");
    revalidatePath("/");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}
