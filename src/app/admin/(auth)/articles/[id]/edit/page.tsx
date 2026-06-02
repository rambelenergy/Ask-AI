import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/ArticleForm";
import { updateArticle } from "@/lib/actions/articles";
import { getArticleById, getArticleCategories } from "@/lib/articles";
import { FileText, ArrowLeft } from "lucide-react";
import Link from "next/link";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params;
  const article = await getArticleById(id);

  if (!article) {
    notFound();
  }

  const categories = await getArticleCategories();

  return (
    <div>
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-[13px] text-slate-500">
        <Link href="/admin/articles" className="flex items-center gap-1 transition hover:text-[var(--green)]">
          <ArrowLeft size={14} /> Articles
        </Link>
        <span>/</span>
        <span className="font-medium text-[#07152a] line-clamp-1 max-w-[300px]">{article.title}</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-6 lg:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--green-soft)] text-[var(--green)] shrink-0">
            <FileText size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-[#07152a]">Edit Article</h1>
            <p className="text-[12px] text-slate-500 truncate">{article.title}</p>
          </div>
        </div>

        <ArticleForm
          action={updateArticle}
          existingCategories={categories}
          initialData={{
            id: article.id,
            title: article.title,
            slug: article.slug,
            excerpt: article.excerpt || "",
            body_html: article.body_html || "",
            cover_image_url: article.cover_image_url || "",
            category: article.category || "",
            author: article.author || "",
            source_url: article.source_url || "",
            is_featured: article.is_featured,
            status: article.status,
            summarize: article.summarize || "",
          }}
        />
      </div>
    </div>
  );
}
