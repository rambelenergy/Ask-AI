import type { Metadata } from "next";
import Link from "next/link";
import { EnergyFocusHeroVisual } from "@/components/content/EnergyFocusHeroVisual";
import { EnergyFocusGrid } from "@/components/content/EnergyFocusGrid";
import { EnergyFocusCTA } from "@/components/content/EnergyFocusCTA";

export const metadata: Metadata = {
  title: "Energy Focus",
};

export default function EnergyFocusPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--line)] bg-white">
        <EnergyFocusHeroVisual />
        <div className="relative container-page py-24">
          <nav aria-label="Breadcrumb" className="mb-7 text-sm font-semibold text-[var(--green)]">
            <Link href="/" className="transition hover:text-[var(--navy)]">Home</Link>
            <span className="mx-2 text-slate-300">/</span>
            <span aria-current="page">Energy Focus</span>
          </nav>
          <div className="max-w-[900px]">
            <h1 className="text-[70px] font-bold leading-[0.98] tracking-[-0.045em] text-[var(--navy)]">
              Energy Focus
            </h1>
            <p className="mt-8 max-w-[850px] text-[22px] leading-9 text-[var(--muted)]">
              The key energy themes and strategic topics covered by RamBelEnergy across Algeria, Africa, the Mediterranean, and Europe.
            </p>
          </div>
        </div>
      </section>

      <EnergyFocusGrid />
      <EnergyFocusCTA />
    </>
  );
}
