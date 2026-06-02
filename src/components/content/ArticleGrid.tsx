import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { latestArticles } from "@/data/analysis";

export function ArticleGrid() {
  return (
    <section className="container-page py-20">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--green)]">Latest Analysis</div>
          <h2 className="mt-3 text-4xl font-bold tracking-tight text-[var(--navy)]">Recent articles and briefings</h2>
        </div>
      </div>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {latestArticles.map((article) => (
          <article key={article.title} className="group flex min-h-[330px] flex-col border border-[var(--line)] bg-white p-7 transition hover:border-slate-300">
            <div className="mb-5 flex items-center justify-between text-xs font-bold uppercase tracking-[0.13em]">
              <span className="text-[var(--green)]">{article.category}</span>
              <span className="text-slate-400">{article.date}</span>
            </div>
            <h3 className="text-[23px] font-bold leading-tight tracking-tight text-[var(--navy)] group-hover:text-[var(--green)]">
              {article.title}
            </h3>
            <p className="mt-5 flex-1 text-[15px] leading-7 text-[var(--muted)]">{article.excerpt}</p>
            <div className="mt-7 border-t border-[var(--line)] pt-5">
              <div className="mb-4 text-xs font-medium uppercase tracking-[0.12em] text-slate-500">{article.source}</div>
              <Link href={article.href} className="inline-flex items-center gap-2 text-sm font-bold text-[var(--green)]">
                Read More <ArrowRight size={15} />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
