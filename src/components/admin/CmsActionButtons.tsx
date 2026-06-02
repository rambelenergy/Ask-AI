"use client";

import Link from "next/link";
import { Edit3, Eye, Trash2 } from "lucide-react";

type CmsActionButtonsProps = {
  editHref: string;
  previewHref: string;
  onDelete: () => void;
  deletePending?: boolean;
};

export function CmsActionButtons({
  editHref,
  previewHref,
  onDelete,
  deletePending,
}: CmsActionButtonsProps) {
  return (
    <div className="flex justify-end gap-2">
      <Link
        href={editHref}
        className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-600 transition hover:text-[#0b5f4d]"
        title="Edit"
      >
        <Edit3 size={16} />
      </Link>
      <Link
        href={previewHref}
        target="_blank"
        className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-600 transition hover:text-[#0b5f4d]"
        title="Preview"
      >
        <Eye size={16} />
      </Link>
      <button
        onClick={onDelete}
        disabled={deletePending}
        className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-600 transition hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
