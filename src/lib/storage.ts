import { createClient } from "@/lib/supabase/client";

const BUCKET = "attatchment";
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function validateImage(file: File): string | null {
  if (!file.type.startsWith("image/")) {
    return "Only image files are allowed.";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be less than 5MB.";
  }
  return null;
}

export function validateFile(file: File): string | null {
  if (file.size > MAX_FILE_SIZE) {
    return "File must be less than 10MB.";
  }
  return null;
}

function extractStoragePath(publicUrl: string): string | null {
  if (!publicUrl || publicUrl.startsWith("/")) return null;
  try {
    const url = new URL(publicUrl);
    const match = url.pathname.match(/\/storage\/v1\/object\/public\/attatchment\/(.+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function uploadImage(file: File, slug: string): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";

  const safeSlug = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");

  const path = `articles/${safeSlug}-${Date.now()}.${ext}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(uploadData.path);

  return urlData.publicUrl;
}

export async function deleteImage(publicUrl: string): Promise<void> {
  const path = extractStoragePath(publicUrl);
  if (!path) return;

  const supabase = createClient();
  await supabase.storage.from(BUCKET).remove([path]);
}

export async function uploadFile(file: File, slug: string): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";

  const safeSlug = slug
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-");

  const path = `publications/${safeSlug}-${Date.now()}.${ext}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(uploadData.path);

  return urlData.publicUrl;
}
