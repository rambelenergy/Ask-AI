import Link from "next/link";
import { Edit3, FileText, ArrowUpRight } from "lucide-react";
import { getArticles } from "@/lib/articles";
import { CmsStatusBadge } from "@/components/admin/CmsStatusBadge";
import { DeleteArticleButton } from "@/components/admin/DeleteArticleButton";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const articles = await getArticles();
  const params = await searchParams;

  return (
    <div>
      {/* Success Toast */}
      {params?.success === "created" && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          Article created successfully.
        </div>
      )}
      {params?.success === "updated" && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          Article updated successfully.
        </div>
      )}
      {params?.success === "deleted" && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          Article deleted successfully.
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-[#07152a]">Articles</h2>
            <p className="mt-0.5 text-[13px] text-slate-500">Manage news, analysis, and editorial content</p>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-slate-400">
            <FileText size={16} />
            {articles.length} total
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
              <FileText size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-[#07152a]">No articles yet</p>
            <p className="mt-1 text-[13px] text-slate-500">Create your first article to get started.</p>
            <Link
              href="/admin/articles/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--green)] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0e4b40]"
            >
              Create Article
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="divide-y divide-slate-50 md:hidden">
              {articles.map((article) => (
                <div key={article.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[#07152a] text-[13px] leading-snug line-clamp-2">{article.title}</div>
                      <div className="mt-1 font-mono text-[10px] text-slate-400">/{article.slug}</div>
                      <div className="mt-1.5 flex items-center gap-2 text-[12px] text-slate-500">
                        <span>{article.category || "—"}</span>
                        <span>·</span>
                        <CmsStatusBadge status={article.status} />
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[var(--green)] hover:text-[var(--green)]"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </Link>
                      <Link
                        href={`/analysis/${article.slug}`}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[var(--navy)]"
                        title="Preview"
                      >
                        <ArrowUpRight size={14} />
                      </Link>
                      <DeleteArticleButton id={article.id} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table view */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="bg-[#f8faf9] text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                    <th className="px-6 py-4 font-semibold">Title</th>
                    <th className="hidden px-6 py-4 font-semibold lg:table-cell">Category</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="hidden px-6 py-4 font-semibold lg:table-cell">Last Updated</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {articles.map((article) => (
                    <tr key={article.id} className="table-row-hover group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#07152a] leading-snug">{article.title}</div>
                        <div className="mt-0.5 font-mono text-[11px] text-slate-400">/{article.slug}</div>
                      </td>
                      <td className="hidden px-6 py-4 text-slate-600 lg:table-cell">{article.category || "—"}</td>
                      <td className="px-6 py-4">
                        <CmsStatusBadge status={article.status} />
                      </td>
                      <td className="hidden px-6 py-4 text-slate-500 lg:table-cell">{formatDate(article.updated_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1.5 opacity-60 transition-opacity group-hover:opacity-100">
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[var(--green)] hover:text-[var(--green)]"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </Link>
                          <Link
                            href={`/analysis/${article.slug}`}
                            target="_blank"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[var(--navy)]"
                            title="Preview"
                          >
                            <ArrowUpRight size={14} />
                          </Link>
                          <DeleteArticleButton id={article.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
