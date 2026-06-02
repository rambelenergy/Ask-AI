import { Landmark, Newspaper, BookOpen } from "lucide-react";

const cards = [
  { icon: Landmark, title: "Government Materials", text: "Official policy documents, public releases, and institutional references." },
  { icon: Newspaper, title: "News & Market Sources", text: "Selected reporting and market context related to energy security." },
  { icon: BookOpen, title: "Expert Analysis", text: "Interpretation connecting facts, infrastructure, policy, and long-term strategy." },
];

export function SourceApproach() {
  return (
    <section className="container-page py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Source-Based Research Note</div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--navy)]">Source-Based Research Approach</h2>
          <p className="mt-6 text-[17px] leading-8 text-[var(--muted)]">
            Research and publications are built from selected public sources, government materials, market reports, news
            references, and expert interpretation.
          </p>
        </div>
        <div className="grid gap-5 lg:col-span-7 lg:grid-cols-3">
          {cards.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border border-[var(--line)] bg-white p-6">
              <Icon className="mb-5 text-[var(--green)]" size={28} />
              <h3 className="text-xl font-bold text-[var(--navy)]">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
