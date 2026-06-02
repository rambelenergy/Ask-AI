"use client";

import { useState, useActionState, useCallback } from "react";
import { useFormStatus } from "react-dom";
import { Save, Check } from "lucide-react";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

type SiteContentBlockFormProps = {
  blockKey: string;
  label: string;
  currentContent: Record<string, unknown>;
  action: (prevState: unknown, formData: FormData) => Promise<{ success: boolean; error?: string }>;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-9 items-center gap-2 rounded-lg bg-[var(--green)] px-4 text-[12px] font-semibold text-white transition hover:bg-[#0e4b40] disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? <div className="h-3 w-3 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Save size={14} />}
      {pending ? "Saving..." : "Save"}
    </button>
  );
}

function isLongField(key: string): boolean {
  return /description|text|summarize|body|content|note/i.test(key);
}

function useRichText(key: string): boolean {
  return /description|text|summarize|body|content/i.test(key);
}

function ObjectFields({
  content,
  onChange,
}: {
  content: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      {Object.entries(content).map(([key, value]) => (
        <div key={key}>
          <div className="mb-1.5 text-[12px] font-semibold capitalize text-slate-600">
            {key.replace(/_/g, " ")}
          </div>
          {useRichText(key) ? (
            <RichTextEditor
              value={value}
              onChange={(v) => onChange(key, v)}
              placeholder={`Enter ${key.replace(/_/g, " ")}...`}
              height="200px"
            />
          ) : isLongField(key) ? (
            <textarea
              value={value}
              onChange={(e) => onChange(key, e.target.value)}
              rows={4}
              className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] leading-relaxed text-slate-700 placeholder:text-slate-400 focus:border-[var(--green)] focus:outline-none resize-y"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(key, e.target.value)}
              className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-700 placeholder:text-slate-400 focus:border-[var(--green)] focus:outline-none"
            />
          )}
        </div>
      ))}
    </div>
  );
}

function ArrayFields({
  items,
  onChange,
}: {
  items: Record<string, string>[];
  onChange: (index: number, key: string, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={index} className="rounded-lg border border-slate-200 bg-[#f8faf9] p-4">
          <div className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
            Item {String(index + 1).padStart(2, "0")}
          </div>
          <div className="space-y-3">
            {Object.entries(item).map(([key, value]) => (
              <div key={key}>
                <div className="mb-1.5 text-[12px] font-semibold capitalize text-slate-600">
                  {key.replace(/_/g, " ")}
                </div>
                {isLongField(key) ? (
                  <textarea
                    value={value}
                    onChange={(e) => onChange(index, key, e.target.value)}
                    rows={3}
                    className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] leading-relaxed text-slate-700 focus:border-[var(--green)] focus:outline-none resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(index, key, e.target.value)}
                    className="cms-input w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[14px] text-slate-700 focus:border-[var(--green)] focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function SiteContentBlockForm({
  blockKey,
  label,
  currentContent,
  action,
}: SiteContentBlockFormProps) {
  const [state, formAction] = useActionState(action, { success: false });

  const isArray = Array.isArray(currentContent);

  const [objectFields, setObjectFields] = useState<Record<string, string>>(
    Object.fromEntries(
      Object.entries(currentContent).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)])
    )
  );

  const [arrayFields, setArrayFields] = useState<Record<string, string>[]>(
    isArray
      ? (currentContent as Record<string, unknown>[]).map((item) =>
          Object.fromEntries(
            Object.entries(item).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)])
          )
        )
      : []
  );

  const handleObjectChange = useCallback((key: string, value: string) => {
    setObjectFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleArrayChange = useCallback((index: number, key: string, value: string) => {
    setArrayFields((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item))
    );
  }, []);

  const serialized = isArray ? JSON.stringify(arrayFields, null, 2) : JSON.stringify(objectFields, null, 2);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="block_key" value={blockKey} />
      <input type="hidden" name="content" value={serialized} />

      {isArray ? (
        <ArrayFields items={arrayFields} onChange={handleArrayChange} />
      ) : (
        <ObjectFields content={objectFields} onChange={handleObjectChange} />
      )}

      {state.success && (
        <div className="flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-[13px] text-green-800">
          <Check size={14} /> Saved successfully.
        </div>
      )}

      {state.error && (
        <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-[13px] text-red-800">
          {state.error}
        </div>
      )}

      <div className="pt-2">
        <SubmitButton />
      </div>
    </form>
  );
}
