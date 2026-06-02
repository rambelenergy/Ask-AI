import { ShieldCheck, SunMedium, Route, Globe2, MapPinned, Layers } from "lucide-react";
import { focusThemes } from "@/data/energy-focus";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  ShieldCheck,
  SunMedium,
  Route,
  Globe2,
  MapPinned,
  Layers,
};

export function EnergyFocusGrid() {
  return (
    <section className="container-page py-20">
      <div className="mb-10 max-w-[760px]">
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Energy Themes</div>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-[var(--navy)]">Core focus areas covered by RamBelEnergy</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {focusThemes.map((theme) => {
          const Icon = iconMap[theme.icon];
          return (
            <article key={theme.title} className="border border-[var(--line)] bg-white p-7">
              <div className="mb-6 flex h-12 w-12 items-center justify-center border border-[var(--line)] bg-[#f8faf9] text-[var(--green)]">
                <Icon size={24} />
              </div>
              <h3 className="text-xl font-bold text-[var(--navy)]">{theme.title}</h3>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{theme.description}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
