import { Landmark, Newspaper, FileText } from "lucide-react";

const sources = [
  {
    icon: Landmark,
    title: "Government Sources",
    text: "Official policy materials, energy ministry releases, public datasets, and institutional publications.",
  },
  {
    icon: Newspaper,
    title: "News & Market Reports",
    text: "Selected reporting and market information connected to energy security and regional developments.",
  },
  {
    icon: FileText,
    title: "Research & Publications",
    text: "Research papers, policy notes, institutional reports, and expert publications.",
  },
];

export function SourceTrust() {
  return (
    <section className="container-page py-20">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Source trust</div>
          <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--navy)]">Built Around Selected Sources</h2>
          <p className="mt-6 text-[17px] leading-8 text-[var(--muted)]">
            The future AI system will be designed to work with selected and reviewed sources, not random AI-generated content.
          </p>
        </div>
        <div className="grid gap-5 lg:col-span-7">
          {sources.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-6 border border-[var(--line)] bg-white p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center border border-[var(--line)] bg-[#f8faf9] text-[var(--green)]">
                <Icon size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[var(--navy)]">{title}</h3>
                <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
