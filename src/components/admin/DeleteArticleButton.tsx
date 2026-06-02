"use client";

import { Trash2 } from "lucide-react";
import { deleteArticle } from "@/lib/actions/articles";

export function DeleteArticleButton({ id }: { id: string }) {
  return (
    <form action={deleteArticle}>
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        onClick={(e) => {
          if (!confirm("Delete this article? This cannot be undone.")) {
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
