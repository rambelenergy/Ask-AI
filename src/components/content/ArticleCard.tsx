import type { Article as ArticlePreview } from "@/data/homepage";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type ArticleCardProps = {
  article: ArticlePreview;
  featured?: boolean;
};

export function ArticleCard({ article, featured = false }: ArticleCardProps) {
  return (
    <Link
      href={article.href}
      className={`professional-card group flex h-full flex-col ${featured ? "p-7 sm:p-8" : "p-6"}`}
    >
      {/* Meta row */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="tag tag-green">{article.category}</span>
        <time className="shrink-0 text-[11px] font-medium text-slate-400">{article.date}</time>
      </div>

      {/* Title */}
      <h3
        className={`${featured ? "text-[1.5rem]" : "text-[1.1rem]"} font-bold leading-[1.25] tracking-[-0.02em] text-[var(--navy)] transition-colors duration-300 group-hover:text-[var(--green)]`}
      >
        {article.title}
      </h3>

      {/* Excerpt */}
      <p className="mb-6 mt-3 flex-1 text-[14px] leading-[1.7] text-[var(--muted)] line-clamp-3">
        {article.excerpt}
      </p>

      {/* Read more */}
      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--green)] transition-all duration-300 group-hover:gap-2.5">
        Read more
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
