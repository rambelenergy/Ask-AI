import type { Metadata } from "next";
import Link from "next/link";
import { Database, ArrowRight, Tag, Calendar } from "lucide-react";
import { MapGridVisual } from "@/components/content/MapGridVisual";
import { FilterBar } from "@/components/content/FilterBar";
import { SourceInsight } from "@/components/content/SourceInsight";
import { AiPreview } from "@/components/content/AiPreview";
import { PageCTA } from "@/components/content/PageCTA";
import { getPublishedArticles, getFeaturedArticle, getArticleCategories } from "@/lib/articles";
import { T } from "@/components/language/t";

export const metadata: Metadata = {
  title: "News & Analysis",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export default async function AnalysisPage() {
  const articles = await getPublishedArticles();
  const featured = await getFeaturedArticle();
  const categories = await getArticleCategories();
  const sidebar = articles.filter((a) => !a.is_featured).slice(0, 3);
  const gridArticles = articles.filter((a) => !a.is_featured);

  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--line)] bg-white">
        <MapGridVisual />
        <div className="relative container-page py-24">
          <nav aria-label="Breadcrumb" className="mb-7 text-sm font-semibold text-[var(--green)]">
            <Link href="/" className="transition hover:text-[var(--navy)]"><T k="common.home" /></Link>
            <span className="mx-2 text-slate-300">/</span>
            <span aria-current="page"><T k="nav.analysis" /></span>
          </nav>
          <div className="max-w-[780px]">
            <h1 className="text-[72px] font-bold leading-[0.98] tracking-[-0.04em] text-[var(--navy)]">
              <T k="analysis.pageTitle" />
            </h1>
            <p className="mt-8 max-w-[720px] text-[22px] leading-9 text-[var(--muted)]">
              Independent analysis on Algeria–Europe energy relations, gas infrastructure, sustainability, and Mediterranean energy security.
            </p>
          </div>
          <div className="mt-12 flex max-w-[780px] items-center gap-5 border-t border-[var(--line)] pt-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--green-soft)] text-[var(--green)]">
              <Database size={24} />
            </div>
            <p className="text-sm leading-6 text-[var(--muted)]">
              Editorial briefs, policy analysis, infrastructure perspectives, and sustainability intelligence for institutional and professional audiences.
            </p>
          </div>
        </div>
      </section>

      {featured && (
        <section className="container-page py-20">
          <div className="mb-9 flex items-end justify-between border-b border-[var(--line)] pb-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--green)]"><T k="analysis.featured" /></div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--navy)] sm:text-4xl">Selected strategic insight</h2>
            </div>
            <div className="hidden text-sm text-[var(--muted)] md:block">Editorial analysis and policy-oriented briefings</div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <article className="col-span-12 overflow-hidden rounded-xl border border-[var(--line)] bg-white shadow-sm transition hover:shadow-md lg:col-span-7">
              {featured.cover_image_url ? (
                <div className="relative h-[280px] overflow-hidden img-zoom">
                  <img
                    src={featured.cover_image_url}
                    alt={featured.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="relative h-[280px] bg-[var(--navy)]">
                  <div className="absolute inset-0 opacity-80">
                    <svg viewBox="0 0 800 280" className="h-full w-full" fill="none">
                      <path d="M80 230 C210 120 350 170 480 90 C580 30 640 50 730 20" stroke="var(--gold)" strokeWidth="4" strokeDasharray="12 9" />
                      <path d="M0 60 H800 M0 120 H800 M0 180 H800 M120 0 V280 M260 0 V280 M400 0 V280 M540 0 V280 M680 0 V280" stroke="#26435a" strokeWidth="1" />
                      <circle cx="80" cy="230" r="9" fill="var(--gold)" />
                      <circle cx="480" cy="90" r="9" fill="var(--green)" />
                      <circle cx="730" cy="20" r="9" fill="var(--gold)" />
                    </svg>
                  </div>
                  <div className="absolute bottom-6 left-6 rounded-lg bg-white/90 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--navy)]">
                    Strategic Corridor
                  </div>
                </div>
              )}
              <div className="p-9">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--green-soft)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--green)]">
                    <Tag size={12} /> {featured.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
                    <Calendar size={11} /> {featured.published_at ? formatDate(featured.published_at) : ""}
                  </span>
                </div>
                <h3 className="max-w-[760px] text-[2rem] font-bold leading-[1.12] tracking-[-0.03em] text-[var(--navy)]">
                  {featured.title}
                </h3>
                <p className="mt-5 max-w-[700px] text-[17px] leading-8 text-[var(--muted)]">
                  {featured.excerpt}
                </p>
                <Link
                  href={`/analysis/${featured.slug}`}
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[var(--green)] px-5 py-3 text-[13px] font-semibold text-white transition hover:bg-[#0e4b40] hover:shadow-md"
                >
                  Read More <ArrowRight size={14} />
                </Link>
              </div>
            </article>

            <div className="col-span-12 grid gap-5 lg:col-span-5">
              {sidebar.map((article) => (
                <article key={article.id} className="group flex h-full flex-col rounded-xl border border-[var(--line)] bg-white p-7 transition hover:border-slate-300 hover:shadow-md">
                  <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">
                    {article.category}
                  </div>
                  <h3 className="text-[1.15rem] font-bold leading-[1.25] tracking-[-0.02em] text-[var(--navy)] transition-colors group-hover:text-[var(--green)]">
                    {article.title}
                  </h3>
                  <p className="mt-4 flex-1 text-[14px] leading-[1.7] text-[var(--muted)] line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-[13px]">
                    <span className="text-slate-500">{article.published_at ? formatDate(article.published_at) : ""}</span>
                    <Link href={`/analysis/${article.slug}`} className="inline-flex items-center gap-1.5 font-semibold text-[var(--green)] transition group-hover:gap-2.5">
                      Read More <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <FilterBar categories={categories} />

      <section className="container-page py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--green)]"><T k="analysis.latest" /></div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--navy)] sm:text-4xl">Recent articles and briefings</h2>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {gridArticles.map((article) => (
            <article key={article.id} className="group flex min-h-[330px] flex-col rounded-xl border border-[var(--line)] bg-white p-7 transition hover:border-slate-300 hover:shadow-md">
              {article.cover_image_url && (
                <div className="-mx-7 -mt-7 mb-5 h-48 overflow-hidden rounded-t-xl border-b border-[var(--line)]">
                  <img
                    src={article.cover_image_url}
                    alt={article.title}
                    className="h-full w-full object-cover transition group-hover:scale-[1.02]"
                  />
                </div>
              )}
              <div className="mb-5 flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.13em]">
                <span className="text-[var(--green)]">{article.category}</span>
                <span className="text-slate-400">{article.published_at ? formatDate(article.published_at) : ""}</span>
              </div>
              <h3 className="text-[1.25rem] font-bold leading-[1.2] tracking-[-0.02em] text-[var(--navy)] transition-colors group-hover:text-[var(--green)]">
                {article.title}
              </h3>
              <p className="mt-5 flex-1 text-[15px] leading-[1.7] text-[var(--muted)] line-clamp-3">
                {article.excerpt}
              </p>
              <div className="mt-7 border-t border-[var(--line)] pt-5">
                <div className="mb-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{article.source || "Analysis"}</div>
                <Link href={`/analysis/${article.slug}`} className="inline-flex items-center gap-2 text-[13px] font-bold text-[var(--green)] transition group-hover:gap-2.5">
                  Read More <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SourceInsight />
      <AiPreview />
      <PageCTA />
    </>
  );
}
