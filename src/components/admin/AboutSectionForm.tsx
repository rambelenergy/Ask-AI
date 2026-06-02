"use client";

import { useState, useActionState, useCallback } from "react";
import { useFormStatus } from "react-dom";
import { Save, Check } from "lucide-react";

type AboutSectionFormProps = {
  sectionKey: string;
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
  return /biography|sumarize|summarize|note|text|description|body|content/i.test(key);
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
          {isLongField(key) ? (
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

function buildState(content: Record<string, unknown>) {
  const objectFields: Record<string, string> = {};
  const arrayFields: Record<string, Record<string, string>[]> = {};

  for (const [key, value] of Object.entries(content)) {
    if (Array.isArray(value)) {
      arrayFields[key] = (value as Record<string, unknown>[]).map((item) =>
        Object.fromEntries(
          Object.entries(item).map(([k, v]) => [k, typeof v === "string" ? v : JSON.stringify(v)])
        ) as Record<string, string>
      );
    } else {
      objectFields[key] = typeof value === "string" ? value : JSON.stringify(value);
    }
  }

  return { objectFields, arrayFields };
}

export function AboutSectionForm({
  sectionKey,
  label,
  currentContent,
  action,
}: AboutSectionFormProps) {
  const [state, formAction] = useActionState(action, { success: false });

  const { objectFields, arrayFields } = buildState(currentContent);

  const [fields, setFields] = useState(objectFields);
  const [arrays, setArrays] = useState(arrayFields);

  const hasArrays = Object.keys(arrays).length > 0;

  const handleFieldChange = useCallback((key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleArrayChange = useCallback((arrayKey: string, index: number, fieldKey: string, value: string) => {
    setArrays((prev) => ({
      ...prev,
      [arrayKey]: prev[arrayKey].map((item: Record<string, string>, i: number) =>
        i === index ? { ...item, [fieldKey]: value } : item
      ),
    }));
  }, []);

  const serialized = JSON.stringify(
    hasArrays ? { ...fields, ...arrays } : fields,
    null,
    2
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="section_key" value={sectionKey} />
      <input type="hidden" name="content_json" value={serialized} />

      <ObjectFields content={fields} onChange={handleFieldChange} />

      {Object.entries(arrays).map(([arrayKey, items]) => (
        <div key={arrayKey}>
          <div className="mb-3 text-[13px] font-semibold capitalize text-slate-600">
            {arrayKey.replace(/_/g, " ")}
          </div>
          <ArrayFields
            items={items}
            onChange={(index, key, value) => handleArrayChange(arrayKey, index, key, value)}
          />
        </div>
      ))}

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
