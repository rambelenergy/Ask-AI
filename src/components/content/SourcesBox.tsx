import { Link2, Landmark, Newspaper, BookOpen, BarChart3 } from "lucide-react";

const sources = [
  { icon: Landmark, label: "Government source", detail: "Official energy and policy materials" },
  { icon: Newspaper, label: "News source", detail: "Selected regional and market reporting" },
  { icon: BookOpen, label: "Research publication", detail: "Policy papers and institutional reports" },
  { icon: BarChart3, label: "Market report", detail: "Energy market context and infrastructure data" },
];

export function SourcesBox() {
  return (
    <aside className="border border-[var(--line)] bg-white p-6">
      <h3 className="text-xl font-bold text-[var(--navy)]">Sources &amp; References</h3>
      <div className="mt-5 space-y-4">
        {sources.map(({ icon: Icon, label, detail }) => (
          <div key={label} className="flex gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--line)] bg-[#f8faf9] text-[var(--green)]">
              <Icon size={19} />
            </div>
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-[var(--navy)]">
                {label} <Link2 size={13} className="text-slate-400" />
              </div>
              <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 border-l-4 border-[var(--gold)] bg-[#f8faf9] p-4 text-xs leading-6 text-slate-600">
        References are used for context and analysis. Final editorial review is required before publishing.
      </div>
    </aside>
  );
}
