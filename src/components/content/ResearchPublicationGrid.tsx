import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { publications } from "@/data/research";

export function ResearchPublicationGrid() {
  return (
    <section className="container-page py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Publication Library</div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[var(--navy)]">Latest research and publications</h2>
        </div>
      </div>

      <div className="grid gap-7 lg:grid-cols-2">
        {publications.map((pub) => (
          <article key={pub.title} className="border border-[var(--line)] bg-white p-7">
            <div className="mb-5 flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-[0.13em]">
              <span className="rounded-sm bg-[var(--green-soft)] px-3 py-2 text-[var(--green)]">{pub.type}</span>
              <span className="text-slate-500">{pub.date}</span>
            </div>
            <h3 className="text-[27px] font-bold leading-tight tracking-tight text-[var(--navy)]">{pub.title}</h3>
            <p className="mt-5 text-[15px] leading-7 text-[var(--muted)]">{pub.excerpt}</p>

            <div className="mt-7 grid gap-4 border-y border-slate-100 py-5 md:grid-cols-2">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Category</div>
                <div className="mt-2 text-sm font-semibold text-[var(--navy)]">{pub.category}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">Region</div>
                <div className="mt-2 text-sm font-semibold text-[var(--navy)]">{pub.region}</div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={pub.href}
                className="inline-flex items-center gap-2 rounded-sm border border-[var(--green)] bg-[var(--green)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0e4b40]"
              >
                Read More <ArrowRight size={15} />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-sm border border-slate-300 bg-[var(--green)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0e4b40]">
                View Source
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
