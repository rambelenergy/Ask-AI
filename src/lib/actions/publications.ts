"use server";

import { createClient } from "@/lib/supabase/server";
import { generateSlug } from "@/lib/slug";
import type { ActionResult } from "@/types/publication";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
const { deleteImageFromServer } = await import("@/lib/storage-server");
const { deleteFileFromServer } = await import("@/lib/storage-server");

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

export async function createPublication(
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
    const pub_type = formData.get("pub_type") as string;
    const category = formData.get("category") as string;
    const region = formData.get("region") as string;
    const author = formData.get("author") as string;
    const external_url = formData.get("external_url") as string;
    const file_url = formData.get("file_url") as string;
    const status = formData.get("status") as "draft" | "published";
    const summarize = formData.get("summarize") as string;

    if (!title.trim()) {
      return { success: false, error: "Title is required." };
    }
    if (!slug.trim()) {
      return { success: false, error: "Slug is required." };
    }
    if (!pub_type) {
      return { success: false, error: "Publication type is required." };
    }
    if (status === "published" && !body_html.trim()) {
      return { success: false, error: "Content is required for published publications." };
    }

    const supabase = await createClient();
    const published_at = status === "published" ? new Date().toISOString() : null;

    const { error } = await supabase
      .from("publications")
      .insert({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        body_html: body_html.trim() || null,
        cover_image_url: cover_image_url || null,
        pub_type: pub_type || null,
        category: category.trim() || null,
        region: region.trim() || null,
        author: author.trim() || null,
        external_url: external_url.trim() || null,
        file_url: file_url || null,
        status,
        published_at,
        summarize: summarize?.trim() || null,
      });

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "A publication with this slug already exists." };
      }
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/publications");
    revalidatePath("/research");
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}

export async function updatePublication(
  _prevState: unknown,
  formData: FormData
): Promise<ActionResult> {
  try {
    await requireAuth();

    const id = formData.get("id") as string;
    if (!id) {
      return { success: false, error: "Publication ID is missing." };
    }

    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const body_html = formData.get("body_html") as string;
    const cover_image_url = formData.get("cover_image_url") as string;
    const pub_type = formData.get("pub_type") as string;
    const category = formData.get("category") as string;
    const region = formData.get("region") as string;
    const author = formData.get("author") as string;
    const external_url = formData.get("external_url") as string;
    const file_url = formData.get("file_url") as string;
    const status = formData.get("status") as "draft" | "published";
    const summarize = formData.get("summarize") as string;

    if (!title.trim()) {
      return { success: false, error: "Title is required." };
    }
    if (!slug.trim()) {
      return { success: false, error: "Slug is required." };
    }
    if (!pub_type) {
      return { success: false, error: "Publication type is required." };
    }
    if (status === "published" && !body_html.trim()) {
      return { success: false, error: "Content is required for published publications." };
    }

    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("publications")
      .select("cover_image_url, file_url, body_html")
      .eq("id", id)
      .single();

    if (existing?.cover_image_url && existing.cover_image_url !== cover_image_url) {
      await deleteImageFromServer(existing.cover_image_url);
    }

    if (existing?.file_url && existing.file_url !== file_url) {
      await deleteFileFromServer(existing.file_url);
    }

    const published_at = status === "published" ? new Date().toISOString() : null;

    const { error } = await supabase
      .from("publications")
      .update({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        body_html: body_html.trim() || null,
        cover_image_url: cover_image_url || null,
        pub_type: pub_type || null,
        category: category.trim() || null,
        region: region.trim() || null,
        author: author.trim() || null,
        external_url: external_url.trim() || null,
        file_url: file_url || null,
        status,
        published_at,
        summarize: summarize?.trim() || null,
      })
      .eq("id", id);

    if (error) {
      if (error.code === "23505") {
        return { success: false, error: "A publication with this slug already exists." };
      }
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/publications");
    revalidatePath("/research");
    revalidatePath(`/research/${slug}`);
    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "An unexpected error occurred.",
    };
  }
}

export async function deletePublication(formData: FormData): Promise<void> {
  await requireAuth();

  const id = formData.get("id") as string;
  if (!id) return;

  const supabase = await createClient();

  const { data: publication } = await supabase
    .from("publications")
    .select("cover_image_url, file_url")
    .eq("id", id)
    .single();

  if (publication?.cover_image_url) {
    await deleteImageFromServer(publication.cover_image_url);
  }

  if (publication?.file_url) {
    await deleteFileFromServer(publication.file_url);
  }

  const { error } = await supabase.from("publications").delete().eq("id", id);
  if (error) return;

  revalidatePath("/admin/publications");
  revalidatePath("/research");
  redirect("/admin/publications?success=deleted");
}
