"use server";

import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import type { ActionResult } from "@/types/article";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
const { deleteImageFromServer } = await import("@/lib/storage-server");

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

export async function createArticle(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAuth();

    const title = formData.get("title") as string;
    const slug = (formData.get("slug") as string) || generateSlug(title);
    const excerpt = formData.get("excerpt") as string;
    const body_html = formData.get("body_html") as string;
    const cover_image_url = formData.get("cover_image_url") as string;
    const category = formData.get("category") as string;
    const author = formData.get("author") as string;
    const source_url = formData.get("source_url") as string;
    const is_featured = formData.get("is_featured") === "on";
    const status = formData.get("status") as "draft" | "published";
    const summarize = formData.get("summarize") as string;

    if (!title.trim()) {
      return { success: false, error: "Title is required." };
    }
    if (!slug.trim()) {
      return { success: false, error: "Slug is required." };
    }
    if (status === "published" && !body_html.trim()) {
      return { success: false, error: "Content is required for published articles." };
    }

    const supabase = await createClient();
    const published_at = status === "published" ? new Date().toISOString() : null;

    const { error } = await supabase
      .from("articles")
      .insert({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        body_html: body_html.trim() || null,
        cover_image_url: cover_image_url || null,
        category: category.trim() || null,
        author: author.trim() || null,
        source_url: source_url.trim() || null,
        is_featured,
        status,
        published_at,
        summarize: summarize?.trim() || null,
      });

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "An article with this slug already exists." };
      }
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/articles");
    revalidatePath("/analysis");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}

export async function updateArticle(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAuth();

    const id = formData.get("id") as string;
    if (!id) {
      return { success: false, error: "Article ID is missing." };
    }

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const body_html = formData.get("body_html") as string;
    const cover_image_url = formData.get("cover_image_url") as string;
    const category = formData.get("category") as string;
    const author = formData.get("author") as string;
    const source_url = formData.get("source_url") as string;
    const is_featured = formData.get("is_featured") === "on";
    const status = formData.get("status") as "draft" | "published";
    const summarize = formData.get("summarize") as string;

    if (!title.trim()) {
      return { success: false, error: "Title is required." };
    }
    if (!slug.trim()) {
      return { success: false, error: "Slug is required." };
    }
    if (status === "published" && !body_html.trim()) {
      return { success: false, error: "Content is required for published articles." };
    }

    const supabase = await createClient();

    // Delete old image if cover changed or was removed
    const { data: existing } = await supabase
      .from("articles")
      .select("cover_image_url, body_html")
      .eq("id", id)
      .single();

    if (existing?.cover_image_url && existing.cover_image_url !== cover_image_url) {
      await deleteImageFromServer(existing.cover_image_url);
    }

    const published_at = status === "published" ? new Date().toISOString() : null;

    const { error } = await supabase
      .from("articles")
      .update({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        body_html: body_html.trim() || null,
        cover_image_url: cover_image_url || null,
        category: category.trim() || null,
        author: author.trim() || null,
        source_url: source_url.trim() || null,
        is_featured,
        status,
        published_at,
        summarize: summarize?.trim() || null,
      })
      .eq("id", id);

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "An article with this slug already exists." };
      }
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/articles");
    revalidatePath("/analysis");
    revalidatePath(`/analysis/${slug}`);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}

export async function deleteArticle(formData: FormData): Promise<void> {
  await requireAuth();

  const id = formData.get("id") as string;
  if (!id) return;

  const supabase = await createClient();

  // Delete associated image from storage
  const { data: article } = await supabase
    .from("articles")
    .select("cover_image_url")
    .eq("id", id)
    .single();

  if (article?.cover_image_url) {
    await deleteImageFromServer(article.cover_image_url);
  }

  const { error } = await supabase.from("articles").delete().eq("id", id);
  if (error) return;

  revalidatePath("/admin/articles");
  revalidatePath("/analysis");
  redirect("/admin/articles?success=deleted");
}
