import Link from "next/link";
import { ArrowUpRight, FileText, Clock, Globe, Brain } from "lucide-react";
import { CmsStatCards } from "@/components/admin/CmsStatCards";
import { CmsStatusBadge } from "@/components/admin/CmsStatusBadge";
import { getArticles } from "@/lib/articles";
import { getPublications } from "@/lib/publications";

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminDashboard() {
  const articles = await getArticles();
  const publications = await getPublications();

  const recentContent = [
    ...articles.map((a) => ({
      id: a.id,
      title: a.title,
      type: "Article" as const,
      category: a.category || "—",
      status: a.status,
      updated_at: a.updated_at,
      editHref: `/admin/articles/${a.id}/edit`,
      previewHref: `/analysis/${a.slug}`,
      kind: "article" as const,
    })),
    ...publications.map((p) => ({
      id: p.id,
      title: p.title,
      type: p.pub_type || "Publication" as const,
      category: p.category || "—",
      status: p.status,
      updated_at: p.updated_at,
      editHref: `/admin/publications/${p.id}/edit`,
      previewHref: `/research/${p.slug}`,
      kind: "publication" as const,
    })),
  ]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 8);

  return (
    <>
      <CmsStatCards />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Content Table */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm lg:col-span-2 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div>
              <h2 className="text-[15px] font-bold text-[#07152a]">Recent Content</h2>
              <p className="mt-0.5 text-[12px] text-slate-500">Latest articles and publications</p>
            </div>
            <Link href="/admin/articles" className="text-[12px] font-semibold text-[var(--green)] hover:underline">
              View all
            </Link>
          </div>

          <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
            <table className="w-full min-w-[520px] text-left text-[12px]">
              <thead>
                <tr className="bg-[#f8faf9] text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-5 py-3.5 font-semibold">Title</th>
                  <th className="hidden px-5 py-3.5 font-semibold md:table-cell">Type</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="hidden px-5 py-3.5 font-semibold lg:table-cell">Updated</th>
                  <th className="px-5 py-3.5 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentContent.map((item) => (
                  <tr key={`${item.kind}-${item.id}`} className="table-row-hover group">
                    <td className="max-w-[200px] px-5 py-4 md:max-w-[280px]">
                      <div className="truncate font-medium text-[#07152a]">{item.title}</div>
                      <div className="mt-0.5 text-[11px] text-slate-400">{item.category}</div>
                    </td>
                    <td className="hidden px-5 py-4 text-slate-600 md:table-cell">{item.type}</td>
                    <td className="px-5 py-4">
                      <CmsStatusBadge status={item.status} />
                    </td>
                    <td className="hidden px-5 py-4 text-slate-500 lg:table-cell">{formatDate(item.updated_at)}</td>
                    <td className="px-5 py-4">
                      <Link
                        href={item.editHref}
                        className="inline-flex items-center gap-1 text-[12px] font-semibold text-slate-500 transition group-hover:text-[var(--green)]"
                      >
                        Edit <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-5">
            <h2 className="text-[15px] font-bold text-[#07152a]">Quick Actions</h2>
            <p className="mt-0.5 text-[12px] text-slate-500">Common tasks</p>
          </div>
          <div className="divide-y divide-slate-50">
            <QuickAction
              href="/admin/articles/new"
              icon={FileText}
              label="New Article"
              desc="Create analysis or news piece"
            />
            <QuickAction
              href="/admin/publications/new"
              icon={Globe}
              label="New Publication"
              desc="Add research or policy brief"
            />
            <QuickAction
              href="/admin/content"
              icon={Brain}
              label="Edit Site Content"
              desc="Update homepage and pages"
            />
            <QuickAction
              href="/admin/ai-tools"
              icon={Clock}
              label="AI Summarizer"
              desc="Generate AI summaries"
            />
          </div>
        </section>
      </div>
    </>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  desc,
}: {
  href: string;
  icon: typeof FileText;
  label: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 px-6 py-4 text-[13px] transition hover:bg-slate-50"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--green-soft)] text-[var(--green)]">
        <Icon size={17} />
      </div>
      <div className="flex-1">
        <div className="font-semibold text-[#07152a]">{label}</div>
        <div className="text-[12px] text-slate-500">{desc}</div>
      </div>
      <ArrowUpRight size={14} className="text-slate-300" />
    </Link>
  );
}
