"use server";

import { createClient } from "@/lib/supabase/server";

const BUCKET = "attatchment";

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

export async function deleteImageFromServer(publicUrl: string): Promise<void> {
  const path = extractStoragePath(publicUrl);
  if (!path) return;

  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);

  if (error) {
    console.error("Failed to delete image from storage:", error.message);
  }
}

export async function deleteFileFromServer(fileUrl: string): Promise<void> {
  const path = extractStoragePath(fileUrl);
  if (!path) return;

  const supabase = await createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);

  if (error) {
    console.error("Failed to delete file from storage:", error.message);
  }
}
