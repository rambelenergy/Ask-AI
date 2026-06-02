import { ArticleForm } from "@/components/admin/ArticleForm";
import { createArticle } from "@/lib/actions/articles";
import { getArticleCategories } from "@/lib/articles";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewArticlePage() {
  const categories = await getArticleCategories();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-[13px] text-slate-500">
        <Link href="/admin/articles" className="flex items-center gap-1 transition hover:text-[var(--green)]">
          <ArrowLeft size={14} /> Articles
        </Link>
        <span>/</span>
        <span className="font-medium text-[#07152a]">New Article</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--green-soft)] text-[var(--green)] shrink-0">
            <FileText size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-[#07152a]">New Article</h1>
            <p className="text-[12px] text-slate-500">Create a new news or analysis piece</p>
          </div>
        </div>

        <ArticleForm action={createArticle} existingCategories={categories} />
      </div>
    </div>
  );
}
