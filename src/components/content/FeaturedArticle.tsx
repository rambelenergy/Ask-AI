import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { AnalysisArticle } from "@/data/analysis";
import { featuredArticle, sidebarArticles } from "@/data/analysis";

type ArticleCardProps = {
  article: AnalysisArticle;
  compact?: boolean;
};

function ArticleCard({ article, compact = false }: ArticleCardProps) {
  return (
    <article className="border border-[var(--line)] bg-white p-7">
      <div className={`mb-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--green)]`}>
        {article.category}
      </div>
      <h3 className={`font-bold leading-tight text-[var(--navy)] ${compact ? "text-[22px]" : "text-[26px]"}`}>
        {article.title}
      </h3>
      <p className="mt-4 text-[15px] leading-7 text-[var(--muted)]">{article.excerpt}</p>
      <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-sm">
        <span className="text-slate-500">{article.date}</span>
        <Link href={article.href} className="font-semibold text-[var(--green)]">
          Read More
        </Link>
      </div>
    </article>
  );
}

export function FeaturedArticle() {
  return (
    <section className="container-page py-20">
      <div className="mb-9 flex items-end justify-between border-b border-[var(--line)] pb-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Featured Analysis</div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[var(--navy)]">Selected strategic insight</h2>
        </div>
        <div className="hidden text-sm text-[var(--muted)] md:block">Editorial analysis and policy-oriented briefings</div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <article className="col-span-12 overflow-hidden rounded-sm border border-[var(--line)] bg-white lg:col-span-7">
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
            <div className="absolute bottom-6 left-6 rounded bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--navy)]">
              Strategic Corridor
            </div>
          </div>
          <div className="p-9">
            <div className="mb-5 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.14em]">
              <span className="text-[var(--green)]">{featuredArticle.category}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span className="text-slate-500">{featuredArticle.date}</span>
            </div>
            <h3 className="max-w-[760px] text-[34px] font-bold leading-tight tracking-tight text-[var(--navy)]">
              {featuredArticle.title}
            </h3>
            <p className="mt-5 max-w-[700px] text-[17px] leading-8 text-[var(--muted)]">
              {featuredArticle.excerpt}
            </p>
            <Link
              href={featuredArticle.href}
              className="mt-8 inline-flex items-center gap-2 rounded border border-[var(--green)] bg-[var(--green)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0e4b40]"
            >
              Read More <ArrowRight size={16} />
            </Link>
          </div>
        </article>

        <div className="col-span-12 grid gap-5 lg:col-span-5">
          {sidebarArticles.map((article) => (
            <ArticleCard key={article.title} article={article} compact />
          ))}
        </div>
      </div>
    </section>
  );
}
