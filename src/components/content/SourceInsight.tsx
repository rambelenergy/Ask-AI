import { Landmark, Newspaper, FileText } from "lucide-react";

const cards = [
  {
    icon: Landmark,
    title: "Government Sources",
    text: "Policy materials, institutional releases, public data, and official energy-sector references.",
  },
  {
    icon: Newspaper,
    title: "News & Market Reports",
    text: "Selected coverage from energy markets, regional developments, and trusted news reporting.",
  },
  {
    icon: FileText,
    title: "Expert Analysis",
    text: "Interpretation that connects facts, strategy, infrastructure, and long-term policy direction.",
  },
];

export function SourceInsight() {
  return (
    <section className="bg-[var(--navy)] py-20 text-white">
      <div className="container-page">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--gold)]">Source-Based Insight</div>
            <h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight">
              Research clarity built from selected public sources.
            </h2>
            <p className="mt-6 text-[17px] leading-8 text-slate-300">
              Analysis is built from selected public sources, government materials, news reports, and expert interpretation.
            </p>
          </div>
          <div className="grid gap-5 lg:col-span-7 lg:grid-cols-3">
            {cards.map(({ icon: Icon, title, text }) => (
              <div key={title} className="border border-white/10 bg-white/[0.04] p-6">
                <Icon className="mb-5 text-[var(--gold)]" size={28} />
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-4 text-sm leading-7 text-slate-300">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
