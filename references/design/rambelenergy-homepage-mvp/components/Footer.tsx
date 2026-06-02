import Link from "next/link";
import type { FocusArea, NavItem } from "@/data/homepage";

type FooterProps = {
  items: NavItem[];
  areas: FocusArea[];
};

export function Footer({ items, areas }: FooterProps) {
  return (
    <footer className="bg-[var(--navy)] text-white">
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1.35fr_0.8fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-bold tracking-[-0.03em]">RamBelEnergy</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
            Professional energy analysis and sustainability intelligence focused on Algeria–Europe relations and Mediterranean energy security.
          </p>
        </div>
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">Navigation</p>
          <ul className="space-y-3 text-sm text-slate-300">
            {items.slice(0, 5).map((item) => (
              <li key={item.href}><Link className="hover:text-white" href={item.href}>{item.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">Focus Areas</p>
          <ul className="space-y-3 text-sm text-slate-300">
            {areas.slice(0, 4).map((area) => <li key={area.title}>{area.title}</li>)}
          </ul>
        </div>
        <div>
          <p className="mb-5 text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">Contact</p>
          <p className="text-sm leading-7 text-slate-300">Contact details placeholder<br />Institutional inquiries<br />Research collaboration</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-6">
        <div className="container-page text-xs text-slate-400">© {new Date().getFullYear()} RamBelEnergy. Copyright placeholder. All rights reserved.</div>
      </div>
    </footer>
  );
}
