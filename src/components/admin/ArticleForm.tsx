"use client";

import { generateSlug } from "@/lib/slug";
import { validateImage, uploadImage } from "@/lib/storage";
import { CmsField } from "@/components/admin/CmsField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useState, useEffect, useRef, useActionState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Save, Send, Link2, RefreshCw, Image, X, Loader2 } from "lucide-react";

type ArticleFormProps = {
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    body_html: string;
    cover_image_url: string;
    category: string;
    author: string;
    source_url: string;
    is_featured: boolean;
    status: "draft" | "published";
    summarize: string;
  };
  existingCategories: string[];
};

function SubmitButton({ label, uploading }: { label: string; uploading?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending || uploading}
      className="inline-flex h-10 items-center gap-2 rounded-lg bg-[var(--green)] px-5 text-[13px] font-semibold text-white transition hover:bg-[#0e4b40] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Send size={15} />
      {pending ? "Saving..." : label}
    </button>
  );
}

export function ArticleForm({ action, initialData, existingCategories }: ArticleFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, { success: false });
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.cover_image_url || null);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || "");
  const [uploading, setUploading] = useState(false);
  const [summarize, setSummarize] = useState(initialData?.summarize || "");
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [regenerating, setRegenerating] = useState(false);
  const [bodyHtml, setBodyHtml] = useState(initialData?.body_html || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      router.push("/admin/articles?success=" + (initialData ? "updated" : "created"));
      router.refresh();
    }
  }, [state.success, router, initialData]);

  useEffect(() => {
    if (title) {
      setSlug(generateSlug(title));
    }
  }, [title]);

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateImage(file);
    if (error) { setImageError(error); return; }
    setImageError(null);
    setUploading(true);
    try {
      const url = await uploadImage(file, slug);
      setImagePreview(url);
      setCoverImageUrl(url);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function handleRemoveImage() {
    setImagePreview(null);
    setImageError(null);
    setCoverImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleRegenerateSummary() {
    if (regenerateCount >= 3) return;
    if (!bodyHtml?.trim()) return;
    setRegenerating(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operation: "summarize", content: bodyHtml.trim() }),
      });
      const data = await res.json();
      if (data.success && data.result) {
        setSummarize(data.result);
        setRegenerateCount((prev) => prev + 1);
      }
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <form action={formAction} className="space-y-6">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="cover_image_url" value={coverImageUrl} />
      <input type="hidden" name="summarize" value={summarize} />
      <input type="hidden" name="body_html" value={bodyHtml} />

      {state.error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <X size={15} />
          {state.error}
        </div>
      )}

      {/* Title & Slug row */}
      <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
        <CmsField label="Title" hint="Required">
          <input
            id="title" name="title" type="text" required
            defaultValue={initialData?.title}
            onChange={(e) => setTitle(e.target.value)}
            className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] font-medium text-slate-700 placeholder:text-slate-400 focus:border-[var(--green)] focus:outline-none"
            placeholder="Article title"
          />
        </CmsField>

        <CmsField label="Slug" hint="Auto-generated from title">
          <input
            id="slug" name="slug" type="text" required
            value={slug}
            readOnly
            className="cms-input w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-[13px] font-mono text-slate-500 cursor-not-allowed focus:outline-none"
          />
        </CmsField>
      </div>

      {/* Excerpt */}
      <CmsField label="Excerpt" hint="Shown on cards and listings">
        <textarea
          id="excerpt" name="excerpt" rows={3}
          defaultValue={initialData?.excerpt}
          className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:border-[var(--green)] focus:outline-none resize-y"
          placeholder="Brief summary for listing cards"
        />
      </CmsField>

      {/* Cover Image */}
      <CmsField label="Cover Image">
        <div className="flex flex-col items-start gap-4 md:flex-row md:gap-5">
          {imagePreview && (
            <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg border border-slate-200 shadow-sm md:w-52">
              <img src={imagePreview} alt="Cover preview" className="h-full w-full object-cover" />
              <button
                type="button" onClick={handleRemoveImage}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div className="flex flex-1 flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-[#f8faf9] px-4 py-3 text-[13px] text-slate-500 transition hover:border-slate-400 hover:bg-slate-50">
              <Image size={16} />
              <span>{uploading ? "Uploading..." : "Choose cover image"}</span>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} disabled={uploading} className="hidden" />
            </label>
            <p className="text-[11px] text-slate-400">PNG, JPG, WebP. Max 5MB.</p>
            {imageError && <p className="text-[12px] text-red-600 flex items-center gap-1"><X size={12} /> {imageError}</p>}
          </div>
        </div>
      </CmsField>

      {/* Rich Text Editor */}
      <div>
        <RichTextEditor
          label="Content"
          value={bodyHtml}
          onChange={setBodyHtml}
          placeholder="Write your article content here..."
          height="420px"
        />
      </div>

      {/* AI Summary */}
      <CmsField label="AI Summary" hint="Auto-generated from content">
        <div className="space-y-3 rounded-lg border border-slate-200 bg-[#f8faf9] p-4">
          <textarea
            id="summarize" rows={4}
            value={summarize}
            onChange={(e) => setSummarize(e.target.value)}
            className="w-full resize-y rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-700 focus:border-[var(--green)] focus:outline-none"
            placeholder="AI-generated summary. You can edit or regenerate."
          />
          <button
            type="button" onClick={handleRegenerateSummary}
            disabled={regenerating || regenerateCount >= 3}
            className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-[12px] font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {regenerating ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            Regenerate ({3 - regenerateCount} left)
          </button>
        </div>
      </CmsField>

      {/* Category, Author, Source */}
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
        <CmsField label="Category">
          <input
            id="category" name="category" type="text" list="categories"
            defaultValue={initialData?.category}
            className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-700 focus:border-[var(--green)] focus:outline-none"
            placeholder="Energy Security"
          />
          <datalist id="categories">
            {existingCategories.map((cat) => <option key={cat} value={cat} />)}
          </datalist>
        </CmsField>

        <CmsField label="Author">
          <input
            id="author" name="author" type="text"
            defaultValue={initialData?.author}
            className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-700 focus:border-[var(--green)] focus:outline-none"
            placeholder="Mr. Ramdane"
          />
        </CmsField>

        <CmsField label="Source URL">
          <div className="relative">
            <Link2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="source_url" name="source_url" type="url"
              defaultValue={initialData?.source_url}
              className="cms-input w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-[14px] text-slate-700 focus:border-[var(--green)] focus:outline-none"
              placeholder="https://source.com/report"
            />
          </div>
        </CmsField>
      </div>

      {/* Status & Featured */}
      <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:gap-6">
        <CmsField label="Status">
          <div className="flex gap-5 pt-1">
            <label className="flex cursor-pointer items-center gap-2 text-[14px] text-slate-700">
              <input
                type="radio" name="status" value="draft"
                defaultChecked={!initialData || initialData.status === "draft"}
                className="h-4 w-4 accent-[var(--green)]"
              />
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                Draft
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-[14px] text-slate-700">
              <input
                type="radio" name="status" value="published"
                defaultChecked={initialData?.status === "published"}
                className="h-4 w-4 accent-[var(--green)]"
              />
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Published
              </span>
            </label>
          </div>
        </CmsField>

        <label className="flex cursor-pointer items-center gap-2 pb-1 text-[14px] text-slate-700">
          <input
            type="checkbox" name="is_featured"
            defaultChecked={initialData?.is_featured}
            className="h-4 w-4 accent-[var(--green)]"
          />
          <span>Featured article (homepage highlight)</span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
        <SubmitButton label={initialData ? "Save Changes" : "Publish"} uploading={uploading} />
        <button
          type="submit" disabled={uploading}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-[13px] font-semibold text-[#07152a] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={15} /> Save Draft
        </button>
        <a
          href="/admin/articles"
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-[13px] font-semibold text-[#07152a] transition hover:bg-slate-50"
        >
          Cancel
        </a>
      </div>
    </form>
  );
}
