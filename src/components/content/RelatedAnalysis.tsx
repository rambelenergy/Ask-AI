import Link from "next/link";
import type { Article } from "@/types/article";
import { ArrowRight } from "lucide-react";
import { T } from "@/components/language/t";

type RelatedAnalysisProps = {
  articles: Article[];
};

export function RelatedAnalysis({ articles }: RelatedAnalysisProps) {
  if (articles.length === 0) return null;

  return (
    <section className="border-t border-[var(--line)] bg-[#f6f8f7] py-20">
      <div className="container-page">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--green)]">
              <T k="article.related.title" />
            </div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--navy)] sm:text-4xl">
              <T k="home.analysis.readMore" />
            </h2>
          </div>
          <Link href="/analysis" className="hidden text-[13px] font-bold text-[var(--green)] transition hover:underline md:inline-flex">
            <T k="analysis.viewAll" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {articles.map((item) => (
            <article key={item.id} className="group flex h-full flex-col rounded-xl border border-[var(--line)] bg-white p-7 transition hover:border-slate-300 hover:shadow-md">
              <div className="mb-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">
                {item.category}
              </div>
              <Link href={`/analysis/${item.slug}`}>
                <h3 className="text-[1.15rem] font-bold leading-[1.25] tracking-[-0.02em] text-[var(--navy)] transition-colors group-hover:text-[var(--green)]">
                  {item.title}
                </h3>
              </Link>
              <p className="mb-5 mt-3 flex-1 text-[14px] leading-[1.7] text-[var(--muted)] line-clamp-3">
                {item.excerpt}
              </p>
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--green)] transition-all group-hover:gap-2.5">
                <T k="common.readMore" />
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
