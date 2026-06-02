import { ShieldCheck, Route, Newspaper, Globe2 } from "lucide-react";

const cases = [
  {
    icon: ShieldCheck,
    title: "Energy Security Questions",
    text: "Understand Algeria&rsquo;s role in European energy diversification.",
  },
  {
    icon: Route,
    title: "Pipeline Analysis",
    text: "Explore the Nigeria&ndash;Algeria&ndash;Europe gas route and its strategic implications.",
  },
  {
    icon: Newspaper,
    title: "Policy &amp; News Summaries",
    text: "Summarize selected reports, news, and policy materials.",
  },
  {
    icon: Globe2,
    title: "Sustainability Outlook",
    text: "Analyze future opportunities in solar energy and sustainable cooperation.",
  },
];

export function UseCases() {
  return (
    <section className="bg-[#f6f8f7] py-20">
      <div className="container-page">
        <div className="mb-10 max-w-[760px]">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Example use cases</div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--navy)]">
            Designed for researchers, journalists, institutions, and investors.
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {cases.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border border-[var(--line)] bg-white p-7">
              <Icon className="mb-6 text-[var(--green)]" size={30} />
              <h3 className="text-xl font-bold text-[var(--navy)]">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]" dangerouslySetInnerHTML={{ __html: text }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
