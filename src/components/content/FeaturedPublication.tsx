import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ResearchFeaturedVisual } from "@/components/content/ResearchFeaturedVisual";
import { featuredPublication } from "@/data/research";

export function FeaturedPublication() {
  return (
    <section className="container-page py-20">
      <div className="mb-9 flex items-end justify-between border-b border-[var(--line)] pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Featured Publication</div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[var(--navy)]">Strategic research highlight</h2>
        </div>
        <div className="hidden text-sm text-[var(--muted)] md:block">Selected policy and research output</div>
      </div>

      <div className="grid overflow-hidden border border-[var(--line)] bg-white lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ResearchFeaturedVisual />
        </div>

        <div className="p-10 lg:col-span-7">
          <div className="mb-5 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-[0.14em]">
            <span className="rounded-sm bg-[var(--green-soft)] px-3 py-2 text-[var(--green)]">{featuredPublication.type}</span>
            <span className="text-slate-500">{featuredPublication.date}</span>
          </div>
          <h3 className="max-w-[740px] text-[42px] font-bold leading-tight tracking-tight text-[var(--navy)]">
            {featuredPublication.title}
          </h3>
          <p className="mt-6 max-w-[720px] text-[17px] leading-8 text-[var(--muted)]">
            {featuredPublication.excerpt}
          </p>

          <div className="mt-8 grid gap-4 border-y border-[var(--line)] py-6 md:grid-cols-3">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Topic</div>
              <div className="mt-2 font-semibold text-[var(--navy)]">{featuredPublication.category}</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Region</div>
              <div className="mt-2 font-semibold text-[var(--navy)]">{featuredPublication.region}</div>
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Format</div>
              <div className="mt-2 font-semibold text-[var(--navy)]">Brief</div>
            </div>
          </div>

          <Link
            href={featuredPublication.href}
            className="mt-8 inline-flex items-center gap-2 rounded-sm border border-[var(--green)] bg-[var(--green)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0e4b40]"
          >
            Read Publication <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
