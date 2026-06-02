import Link from "next/link";
import { Edit3, ArrowUpRight, BookOpen } from "lucide-react";
import { getPublications } from "@/lib/publications";
import { CmsStatusBadge } from "@/components/admin/CmsStatusBadge";
import { DeletePublicationButton } from "@/components/admin/DeletePublicationButton";

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function PublicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string }>;
}) {
  const publications = await getPublications();
  const params = await searchParams;

  return (
    <div>
      {params?.success === "created" && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500" /> Publication created successfully.
        </div>
      )}
      {params?.success === "updated" && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500" /> Publication updated successfully.
        </div>
      )}
      {params?.success === "deleted" && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 shadow-sm">
          <div className="h-2 w-2 rounded-full bg-green-500" /> Publication deleted successfully.
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-[#07152a]">Research &amp; Publications</h2>
            <p className="mt-0.5 text-[13px] text-slate-500">Manage research notes, policy briefs, and reports</p>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-slate-400">
            <BookOpen size={16} />
            {publications.length} total
          </div>
        </div>

        {publications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-14 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
              <BookOpen size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-[#07152a]">No publications yet</p>
            <p className="mt-1 text-[13px] text-slate-500">Create your first publication to get started.</p>
            <Link
              href="/admin/publications/new"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--green)] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0e4b40]"
            >
              Create Publication
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile card view */}
            <div className="divide-y divide-slate-50 md:hidden">
              {publications.map((pub) => (
                <div key={pub.id} className="px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-[#07152a] text-[13px] leading-snug line-clamp-2">{pub.title}</div>
                      <div className="mt-1 font-mono text-[10px] text-slate-400">/{pub.slug}</div>
                      <div className="mt-1.5 flex items-center gap-2 text-[12px] text-slate-500">
                        <span>{pub.pub_type || "—"}</span>
                        <span>·</span>
                        <span>{pub.category || "—"}</span>
                        <span>·</span>
                        <CmsStatusBadge status={pub.status} />
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-1.5">
                      <Link
                        href={`/admin/publications/${pub.id}/edit`}
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[var(--green)] hover:text-[var(--green)]"
                        title="Edit"
                      >
                        <Edit3 size={14} />
                      </Link>
                      <Link
                        href={`/research/${pub.slug}`}
                        target="_blank"
                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[var(--navy)]"
                        title="Preview"
                      >
                        <ArrowUpRight size={14} />
                      </Link>
                      <DeletePublicationButton id={pub.id} />
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
                    <th className="hidden px-6 py-4 font-semibold lg:table-cell">Type</th>
                    <th className="hidden px-6 py-4 font-semibold xl:table-cell">Category</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="hidden px-6 py-4 font-semibold lg:table-cell">Updated</th>
                    <th className="px-6 py-4 text-right font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {publications.map((pub) => (
                    <tr key={pub.id} className="table-row-hover group">
                      <td className="max-w-[240px] px-6 py-4 lg:max-w-[320px]">
                        <div className="truncate font-medium text-[#07152a] leading-snug">{pub.title}</div>
                        <div className="mt-0.5 font-mono text-[11px] text-slate-400">/{pub.slug}</div>
                      </td>
                      <td className="hidden px-6 py-4 text-slate-600 lg:table-cell">{pub.pub_type || "—"}</td>
                      <td className="hidden px-6 py-4 text-slate-600 xl:table-cell">{pub.category || "—"}</td>
                      <td className="px-6 py-4">
                        <CmsStatusBadge status={pub.status} />
                      </td>
                      <td className="hidden px-6 py-4 text-slate-500 lg:table-cell">{formatDate(pub.updated_at)}</td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1.5 opacity-60 transition-opacity group-hover:opacity-100">
                          <Link
                            href={`/admin/publications/${pub.id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[var(--green)] hover:text-[var(--green)]"
                            title="Edit"
                          >
                            <Edit3 size={14} />
                          </Link>
                          <Link
                            href={`/research/${pub.slug}`}
                            target="_blank"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-[var(--navy)]"
                            title="Preview"
                          >
                            <ArrowUpRight size={14} />
                          </Link>
                          <DeletePublicationButton id={pub.id} />
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
