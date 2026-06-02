import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

export function ResearchContactCTA() {
  return (
    <section className="container-page py-20">
      <div className="grid items-center gap-8 border border-[var(--line)] bg-white p-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Contact / Collaboration</div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[var(--navy)]">
            Research Collaboration &amp; Institutional Inquiries
          </h2>
          <p className="mt-5 max-w-[760px] text-[17px] leading-8 text-[var(--muted)]">
            For research cooperation, media inquiries, or strategic energy discussions, contact RamBelEnergy.
          </p>
        </div>
        <div className="flex justify-start lg:col-span-4 lg:justify-end">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-sm border border-[var(--green)] bg-[var(--green)] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#0e4b40]"
          >
            <Mail size={16} /> Contact <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
