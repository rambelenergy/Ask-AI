import type { Article } from "@/data/homepage";
import { ArrowLink } from "./ArrowLink";

type ArticleCardProps = {
  article: Article;
  featured?: boolean;
};

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <article className={`flex h-full flex-col border border-[var(--line)] bg-[var(--paper)] ${featured ? "p-8" : "p-6"}`}>
      <div className="mb-5 flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.15em]">
        <span className="text-[var(--green)]">{article.category}</span>
        <time className="shrink-0 text-slate-400">{article.date}</time>
      </div>
      <h3 className={`${featured ? "text-[1.8rem]" : "text-xl"} font-bold leading-tight tracking-[-0.025em] text-[var(--navy)]`}>
        {article.title}
      </h3>
      <p className="mb-7 mt-4 flex-1 text-sm leading-7 text-[var(--muted)]">{article.excerpt}</p>
      <ArrowLink href={article.href}>Read more</ArrowLink>
    </article>
  );
}
