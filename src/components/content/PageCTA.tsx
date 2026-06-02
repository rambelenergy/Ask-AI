import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function PageCTA() {
  return (
    <section className="container-page pb-24">
      <div className="grid items-center gap-8 border border-[var(--line)] bg-white p-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Stay Updated</div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[var(--navy)]">Follow independent energy analysis.</h2>
          <p className="mt-5 max-w-[720px] text-[17px] leading-8 text-[var(--muted)]">
            Follow independent analysis on Algeria–Europe energy, sustainability, and strategic cooperation.
          </p>
        </div>
        <div className="flex justify-start lg:col-span-4 lg:justify-end">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded border border-[var(--green)] bg-[var(--green)] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#0e4b40]"
          >
            Contact / Collaborate <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
