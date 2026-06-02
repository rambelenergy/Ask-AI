"use client";

import { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";

const toolbarOptions = [
  [{ header: [1, 2, 3, false] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["blockquote", "link"],
  ["clean"],
];

const formats = [
  "header",
  "bold", "italic", "underline", "strike",
  "color", "background",
  "list", "indent",
  "align",
  "blockquote", "link",
];

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  height?: string;
};

export function RichTextEditor({ value, onChange, placeholder, label, height = "320px" }: RichTextEditorProps) {
  const [QuillEditor, setQuillEditor] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    import("react-quill-new").then((mod) => {
      setQuillEditor(() => mod.default);
    });
  }, []);

  if (!mounted || !QuillEditor) {
    return (
      <div className="space-y-2">
        {label && (
          <div className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</div>
        )}
        <div
          className="flex items-center justify-center rounded-lg border border-slate-200 bg-[#f8faf9] text-sm text-slate-400"
          style={{ height }}
        >
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <div className="mb-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</div>
      )}
      <div className="rich-editor-wrapper rounded-lg border border-slate-200 bg-white overflow-hidden">
        <QuillEditor
          theme="snow"
          value={value}
          onChange={onChange}
          placeholder={placeholder || "Write your content here..."}
          modules={{
            toolbar: {
              container: toolbarOptions,
            },
          }}
          formats={formats}
          style={{ height }}
        />
      </div>
      <p className="text-[11px] text-slate-400">
        Use the toolbar to format text. Supports headings, lists, links, and basic styling.
      </p>
    </div>
  );
}
