import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";
import { ResearchHeroVisual } from "@/components/content/ResearchHeroVisual";
import { ResearchFilterBar } from "@/components/content/ResearchFilterBar";
import { ResearchFocusAreas } from "@/components/content/ResearchFocusAreas";
import { SourceApproach } from "@/components/content/SourceApproach";
import { ResearchAiPreview } from "@/components/content/ResearchAiPreview";
import { ResearchContactCTA } from "@/components/content/ResearchContactCTA";
import { getPublishedPublications, getPublicationCategories, getPublicationTypes } from "@/lib/publications";

export const metadata: Metadata = {
  title: "Research & Publications",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export default async function ResearchPage() {
  const publications = await getPublishedPublications();
  const categories = await getPublicationCategories();
  const types = await getPublicationTypes();

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--line)] bg-white">
        <ResearchHeroVisual />
        <div className="relative container-page py-24">
          <nav aria-label="Breadcrumb" className="mb-7 text-sm font-semibold text-[var(--green)]">
            <Link href="/" className="transition hover:text-[var(--navy)]">Home</Link>
            <span className="mx-2 text-slate-300">/</span>
            <span aria-current="page">Research</span>
          </nav>
          <div className="max-w-[900px]">
            <h1 className="text-[70px] font-bold leading-[0.98] tracking-[-0.045em] text-[var(--navy)]">
              Research &amp; Publications
            </h1>
            <p className="mt-8 max-w-[850px] text-[22px] leading-9 text-[var(--muted)]">
              Selected research notes, policy briefs, and analytical publications on Algeria–Europe energy relations,
              sustainability, and Mediterranean energy security.
            </p>
          </div>
          <div className="mt-12 grid max-w-[760px] grid-cols-3 gap-4 border-t border-[var(--line)] pt-7">
            {[
              ["Policy briefs", "Short strategic publications"],
              ["Research notes", "Focused analytical papers"],
              ["Reports", "Structured research outputs"],
            ].map(([title, desc]) => (
              <div key={title}>
                <div className="text-sm font-bold text-[var(--navy)]">{title}</div>
                <div className="mt-1 text-xs leading-5 text-slate-500">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {publications.length > 0 && (
        <>
          <section className="container-page py-20">
            <div className="mb-10">
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--green)]">Publication Library</div>
              <h2 className="mt-3 text-4xl font-bold tracking-tight text-[var(--navy)]">Latest research and publications</h2>
            </div>
            <div className="grid gap-7 lg:grid-cols-2">
              {publications.map((pub) => (
                <article key={pub.id} className="group flex h-full flex-col rounded-xl border border-[var(--line)] bg-white p-7 transition hover:border-slate-300 hover:shadow-md">
                  {/* Meta */}
                  <div className="mb-5 flex flex-wrap items-center gap-3 text-[11px] font-bold uppercase tracking-[0.13em]">
                    {pub.pub_type && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--green-soft)] px-3 py-1.5 text-[var(--green)]">
                        <BookOpen size={10} />
                        {pub.pub_type}
                      </span>
                    )}
                    {pub.published_at && (
                      <span className="inline-flex items-center gap-1 text-slate-500">
                        <Calendar size={10} />
                        {formatDate(pub.published_at)}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <Link href={`/research/${pub.slug}`}>
                    <h3 className="text-[1.35rem] font-bold leading-tight tracking-[-0.02em] text-[var(--navy)] transition-colors group-hover:text-[var(--green)]">
                      {pub.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="mt-4 flex-1 text-[15px] leading-[1.7] text-[var(--muted)] line-clamp-4">
                    {pub.excerpt}
                  </p>

                  {/* Details */}
                  <div className="mt-6 grid gap-4 border-y border-slate-100 py-5 md:grid-cols-2">
                    {pub.category && (
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Category</div>
                        <div className="mt-1.5 text-[13px] font-semibold text-[var(--navy)]">{pub.category}</div>
                      </div>
                    )}
                    {pub.region && (
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">Region</div>
                        <div className="mt-1.5 text-[13px] font-semibold text-[var(--navy)]">{pub.region}</div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-2.5">
                    <Link
                      href={`/research/${pub.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-[var(--green)] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0e4b40] hover:shadow-md"
                    >
                      Read More <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                    </Link>
                    {pub.external_url && (
                      <a
                        href={pub.external_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-5 py-2.5 text-[13px] font-semibold text-[var(--navy)] transition hover:bg-slate-50"
                      >
                        View Source
                      </a>
                    )}
                    {pub.file_url && (
                      <a
                        href={pub.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-[var(--navy)] px-5 py-2.5 text-[13px] font-semibold text-[var(--navy)] transition hover:bg-[var(--navy)] hover:text-white"
                      >
                        Download
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <ResearchFilterBar categories={categories} types={types} />
        </>
      )}

      <ResearchFocusAreas />
      <SourceApproach />
      <ResearchAiPreview />
      <ResearchContactCTA />
    </>
  );
}
