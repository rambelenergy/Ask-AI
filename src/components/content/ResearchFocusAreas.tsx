import { ShieldCheck, Route, SunMedium, Globe2 } from "lucide-react";

const areas = [
  {
    icon: ShieldCheck,
    title: "Energy Security",
    text: "Research on diversification, supply reliability, strategic routes, and Europe's energy priorities.",
  },
  {
    icon: Route,
    title: "Gas Infrastructure",
    text: "Analysis of pipelines, LNG capacity, interconnections, transit corridors, and investment requirements.",
  },
  {
    icon: SunMedium,
    title: "Solar Energy & Sustainability",
    text: "Coverage of renewable potential, transition pathways, and sustainable cooperation opportunities.",
  },
  {
    icon: Globe2,
    title: "Euro-African Cooperation",
    text: "Strategic insight on energy relationships linking Algeria, Africa, the Mediterranean, and Europe.",
  },
];

export function ResearchFocusAreas() {
  return (
    <section className="border-y border-[var(--line)] bg-[#f6f8f7] py-20">
      <div className="container-page">
        <div className="mb-10 max-w-[760px]">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Research Focus Areas</div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--navy)]">Core research themes</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {areas.map(({ icon: Icon, title, text }) => (
            <div key={title} className="border border-[var(--line)] bg-white p-7">
              <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[var(--line)] bg-[#f8faf9] text-[var(--green)]">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-[var(--navy)]">{title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
