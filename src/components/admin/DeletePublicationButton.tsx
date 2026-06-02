"use client";

import { Trash2 } from "lucide-react";
import { deletePublication } from "@/lib/actions/publications";

export function DeletePublicationButton({ id }: { id: string }) {
  return (
    <form action={deletePublication}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("Delete this publication? This cannot be undone.")) {
            e.preventDefault();
          }
        }}
        className="flex h-9 w-9 items-center justify-center border border-slate-200 text-slate-600 transition hover:text-red-600"
        title="Delete"
      >
        <Trash2 size={16} />
      </button>
    </form>
  );
}
