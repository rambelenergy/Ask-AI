"use client";

import { generateSlug } from "@/lib/slug";
import { validateImage, uploadImage, validateFile, uploadFile } from "@/lib/storage";
import { PUBLICATION_TYPES } from "@/types/publication";
import { CmsField } from "@/components/admin/CmsField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { useState, useEffect, useRef, useActionState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import { Save, Send, Link2, FolderOpen, RefreshCw, Image, X, Loader2 } from "lucide-react";

type PublicationFormProps = {
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    excerpt: string;
    body_html: string;
    cover_image_url: string;
    pub_type: string;
    category: string;
    region: string;
    author: string;
    external_url: string;
    file_url: string;
    status: "draft" | "published";
    summarize: string;
  };
  existingCategories: string[];
  existingRegions: string[];
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

export function PublicationForm({ action, initialData, existingCategories, existingRegions }: PublicationFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, { success: false });
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [imageError, setImageError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.cover_image_url || null);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(
    initialData?.file_url ? initialData.file_url.split("/").pop() || "Current file" : null
  );
  const [fileUrl, setFileUrl] = useState(initialData?.file_url || "");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [summarize, setSummarize] = useState(initialData?.summarize || "");
  const [regenerateCount, setRegenerateCount] = useState(0);
  const [regenerating, setRegenerating] = useState(false);
  const [bodyHtml, setBodyHtml] = useState(initialData?.body_html || "");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) {
      router.push("/admin/publications?success=" + (initialData ? "updated" : "created"));
      router.refresh();
    }
  }, [state.success, router, initialData]);

  useEffect(() => {
    if (title) {
      setSlug(generateSlug(title));
    }
  }, [title]);

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateImage(file);
    if (error) { setImageError(error); return; }
    setImageError(null);
    setUploadingImage(true);
    try {
      const url = await uploadImage(file, slug);
      setImagePreview(url);
      setCoverImageUrl(url);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingImage(false);
    }
  }

  function handleRemoveImage() {
    setImagePreview(null);
    setImageError(null);
    setCoverImageUrl("");
    if (imageInputRef.current) imageInputRef.current.value = "";
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const error = validateFile(file);
    if (error) { setFileError(error); return; }
    setFileError(null);
    setUploadingFile(true);
    try {
      const url = await uploadFile(file, slug);
      setFileName(file.name);
      setFileUrl(url);
    } catch (err) {
      setFileError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingFile(false);
    }
  }

  function handleRemoveFile() {
    setFileName(null);
    setFileError(null);
    setFileUrl("");
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

  const isUploading = uploadingImage || uploadingFile;

  return (
    <form action={formAction} className="space-y-6">
      {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}
      <input type="hidden" name="cover_image_url" value={coverImageUrl} />
      <input type="hidden" name="file_url" value={fileUrl} />
      <input type="hidden" name="summarize" value={summarize} />
      <input type="hidden" name="body_html" value={bodyHtml} />

      {state.error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <X size={15} /> {state.error}
        </div>
      )}

      {/* Title & Slug */}
      <div className="grid gap-5 md:grid-cols-[1.5fr_1fr]">
        <CmsField label="Publication Title" hint="Required">
          <input
            id="title" name="title" type="text" required
            defaultValue={initialData?.title}
            onChange={(e) => setTitle(e.target.value)}
            className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] font-medium text-slate-700 placeholder:text-slate-400 focus:border-[var(--green)] focus:outline-none"
            placeholder="Enter publication title"
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
      <CmsField label="Short Description" hint="Shown on cards">
        <textarea
          id="excerpt" name="excerpt" rows={3}
          defaultValue={initialData?.excerpt}
          className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:border-[var(--green)] focus:outline-none resize-y"
          placeholder="Brief publication description"
        />
      </CmsField>

      {/* Type, Category, Region, Author */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <CmsField label="Type">
          <select
            id="pub_type" name="pub_type" required
            defaultValue={initialData?.pub_type || ""}
            className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-700 focus:border-[var(--green)] focus:outline-none"
          >
            <option value="">Select type...</option>
            {PUBLICATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </CmsField>

        <CmsField label="Category">
          <input
            id="category" name="category" type="text" list="pub-categories"
            defaultValue={initialData?.category}
            className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-700 focus:border-[var(--green)] focus:outline-none"
            placeholder="Energy Security"
          />
          <datalist id="pub-categories">
            {existingCategories.map((cat) => <option key={cat} value={cat} />)}
          </datalist>
        </CmsField>

        <CmsField label="Region">
          <input
            id="region" name="region" type="text" list="pub-regions"
            defaultValue={initialData?.region}
            className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-700 focus:border-[var(--green)] focus:outline-none"
            placeholder="Algeria / Europe"
          />
          <datalist id="pub-regions">
            {existingRegions.map((reg) => <option key={reg} value={reg} />)}
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
      </div>

      {/* Cover Image */}
      <CmsField label="Cover Image">
        <div className="flex flex-col items-start gap-4 md:flex-row md:gap-5">
          {imagePreview && (
            <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-lg border border-slate-200 shadow-sm md:w-52">
              <img src={imagePreview} alt="Cover preview" className="h-full w-full object-cover" />
              <button type="button" onClick={handleRemoveImage} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition hover:bg-black/70">
                <X size={14} />
              </button>
            </div>
          )}
          <div className="flex flex-1 flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-[#f8faf9] px-4 py-3 text-[13px] text-slate-500 transition hover:border-slate-400 hover:bg-slate-50">
              <Image size={16} />
              <span>{uploadingImage ? "Uploading..." : "Choose cover image"}</span>
              <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageSelect} disabled={uploadingImage} className="hidden" />
            </label>
            <p className="text-[11px] text-slate-400">PNG, JPG, WebP. Max 5MB.</p>
            {imageError && <p className="text-[12px] text-red-600 flex items-center gap-1"><X size={12} /> {imageError}</p>}
          </div>
        </div>
      </CmsField>

      {/* File Attachment */}
      <CmsField label="File Attachment (PDF)">
        <div className="flex flex-col items-start gap-4 md:flex-row md:gap-5">
          {fileName && (
            <div className="flex h-36 w-full shrink-0 flex-col items-center justify-center rounded-lg border border-slate-200 bg-[#f8faf9] md:w-52">
              <FolderOpen size={28} className="mb-2 text-slate-400" />
              <p className="max-w-[160px] truncate px-3 text-center text-[12px] font-medium text-[#07152a]">{fileName}</p>
              <button type="button" onClick={handleRemoveFile} className="mt-2 text-[11px] text-red-500 hover:underline">
                Remove
              </button>
            </div>
          )}
          <div className="flex flex-1 flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-[#f8faf9] px-4 py-3 text-[13px] text-slate-500 transition hover:border-slate-400 hover:bg-slate-50">
              <FolderOpen size={16} />
              <span>{uploadingFile ? "Uploading..." : "Attach PDF or document"}</span>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFileSelect} disabled={uploadingFile} className="hidden" />
            </label>
            <p className="text-[11px] text-slate-400">PDF, DOC, DOCX. Max 10MB.</p>
            {fileError && <p className="text-[12px] text-red-600 flex items-center gap-1"><X size={12} /> {fileError}</p>}
          </div>
        </div>
      </CmsField>

      {/* External URL */}
      <CmsField label="External URL">
        <div className="relative">
          <Link2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            id="external_url" name="external_url" type="url"
            defaultValue={initialData?.external_url}
            className="cms-input w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-[14px] text-slate-700 focus:border-[var(--green)] focus:outline-none"
            placeholder="https://example.com/source"
          />
        </div>
      </CmsField>

      {/* Rich Text Editor */}
      <div>
        <RichTextEditor
          label="Content"
          value={bodyHtml}
          onChange={setBodyHtml}
          placeholder="Write your publication content here..."
          height="380px"
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

      {/* Status */}
      <CmsField label="Status">
        <div className="flex gap-5 pt-1">
          <label className="flex cursor-pointer items-center gap-2 text-[14px] text-slate-700">
            <input type="radio" name="status" value="draft" defaultChecked={!initialData || initialData.status === "draft"} className="h-4 w-4 accent-[var(--green)]" />
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Draft
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-[14px] text-slate-700">
            <input type="radio" name="status" value="published" defaultChecked={initialData?.status === "published"} className="h-4 w-4 accent-[var(--green)]" />
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" /> Published
            </span>
          </label>
        </div>
      </CmsField>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
        <SubmitButton label={initialData ? "Save Changes" : "Publish"} uploading={isUploading} />
        <button type="submit" disabled={isUploading} className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-[13px] font-semibold text-[#07152a] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">
          <Save size={15} /> Save Draft
        </button>
        <a href="/admin/publications" className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 text-[13px] font-semibold text-[#07152a] transition hover:bg-slate-50">
          Cancel
        </a>
      </div>
    </form>
  );
}
