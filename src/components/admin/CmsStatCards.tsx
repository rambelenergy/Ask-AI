import { getArticleCounts } from "@/lib/articles";
import { getPublicationCount } from "@/lib/publications";
import { Newspaper, CheckCircle2, Clock3, Library } from "lucide-react";

export async function CmsStatCards() {
  const { total, published, drafts } = await getArticleCounts();
  const researchItems = await getPublicationCount();

  const stats = [
    { label: "Total Articles", value: total, icon: Newspaper, hint: "All content items", color: "text-slate-700", bg: "bg-slate-50" },
    { label: "Published", value: published, icon: CheckCircle2, hint: "Live on site", color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Drafts", value: drafts, icon: Clock3, hint: "In review", color: "text-amber-600", bg: "bg-amber-50" },
    { label: "Research Items", value: researchItems, icon: Library, hint: "Briefs & reports", color: "text-[var(--green)]", bg: "bg-[var(--green-soft)]" },
  ];

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {stats.map(({ label, value, icon: Icon, hint, color, bg }) => (
        <div key={label} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-slate-500">{label}</div>
              <div className="mt-2 text-3xl font-bold tracking-tight text-[#07152a]">{value}</div>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${bg} ${color}`}>
              <Icon size={20} />
            </div>
          </div>
          <div className="mt-4 border-t border-slate-50 pt-3 text-[12px] text-slate-400">{hint}</div>
        </div>
      ))}
    </section>
  );
}
