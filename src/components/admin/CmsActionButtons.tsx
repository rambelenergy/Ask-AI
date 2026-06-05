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
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)] transition hover:border-[var(--green)] hover:text-[var(--green)]"
        title="Edit"
      >
        <Edit3 size={16} />
      </Link>
      <Link
        href={previewHref}
        target="_blank"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)] transition hover:border-[var(--green)] hover:text-[var(--green)]"
        title="Preview"
      >
        <Eye size={16} />
      </Link>
      <button
        onClick={onDelete}
        disabled={deletePending}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line)] text-[var(--muted)] transition hover:border-red-400 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
}
