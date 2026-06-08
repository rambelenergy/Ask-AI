import type { Metadata } from "next";
import Link from "next/link";
import { KeyPointsBox } from "@/components/content/KeyPointsBox";
import { SourcesBox } from "@/components/content/SourcesBox";
import { SummarizeBox } from "@/components/content/SummarizeBox";
import { RelatedAnalysis } from "@/components/content/RelatedAnalysis";
import { ArticleContactCTA } from "@/components/content/ArticleContactCTA";
import { getArticleBySlug, getRelatedArticles } from "@/lib/articles";
import { Calendar, User, ArrowLeft, Tag, ExternalLink } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  return {
    title: article?.title || slug.replace(/-/g, " "),
  };
}

export default async function AnalysisArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return (
      <section className="container-page py-24">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-[13px] font-medium text-[var(--green)]">
          <Link href="/" className="transition hover:text-[var(--navy)]">Home</Link>
          <span className="text-slate-300">/</span>
          <Link href="/analysis" className="transition hover:text-[var(--navy)]">Analysis</Link>
          <span className="text-slate-300">/</span>
          <span aria-current="page" className="text-[var(--muted)]">Not Found</span>
        </nav>
        <h1 className="text-3xl font-bold text-[var(--navy)]">Article not found</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">
          This article does not exist or has not been published.
        </p>
        <Link href="/analysis" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--green)]">
          <ArrowLeft size={15} /> Back to Analysis
        </Link>
      </section>
    );
  }

  const related = await getRelatedArticles(slug, article.category);
  const formattedDate = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <>
      {/* <ArticleVisual /> */}

      <section className="container-page grid gap-8 pb-16 pt-6 sm:pt-8 lg:grid-cols-12 lg:gap-12 lg:pb-20">
        <div className="lg:col-span-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[13px] font-medium text-[var(--green)]">
            <Link href="/" className="transition hover:text-[var(--navy)]">Home</Link>
            <span className="text-slate-300">/</span>
            <Link href="/analysis" className="transition hover:text-[var(--navy)]">Analysis</Link>
            <span className="text-slate-300">/</span>
            <span aria-current="page" className="text-[var(--muted)] break-words">{article.title}</span>
          </nav>

          {/* Cover Image */}
          {article.cover_image_url && (
            <div className="mb-8 overflow-hidden rounded-xl border border-[var(--line)] shadow-sm">
              <img
                src={article.cover_image_url}
                alt={article.title}
                className="h-[200px] w-full object-cover sm:h-[340px] lg:h-[400px]"
                loading="lazy"
                decoding="async"
              />
            </div>
          )}

          {/* Category pill */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--green-soft)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--green)]">
              <Tag size={12} />
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="break-words text-[1.7rem] font-bold leading-[1.12] tracking-[-0.03em] text-[var(--navy)] sm:text-[2.2rem] lg:text-[2.8rem]">
            {article.title}
          </h1>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="mt-5 break-words text-base leading-[1.7] text-[var(--muted)] sm:text-lg lg:text-xl">
              {article.excerpt}
            </p>
          )}

          {/* Author & Date */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-[var(--line)] py-4 text-[13px] text-[var(--muted)]">
            {article.author && (
              <div className="flex items-center gap-2">
                <User size={14} className="text-slate-400" />
                <span className="font-medium">{article.author}</span>
              </div>
            )}
            {formattedDate && (
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span>{formattedDate}</span>
              </div>
            )}
            {article.source_url && (
              <a
                href={article.source_url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 text-[var(--green)] underline-offset-2 transition hover:underline"
              >
                <ExternalLink size={13} /> Source
              </a>
            )}
          </div>

          {/* Body */}
          {article.body_html && (
            <div
              className="article-body mt-8 text-[16px] leading-[1.8] text-slate-700 sm:mt-10 sm:text-[17px]"
              dangerouslySetInnerHTML={{ __html: article.body_html }}
            />
          )}

          {/* Bottom nav */}
          <div className="mt-12 border-t border-[var(--line)] pt-8">
            <Link
              href="/analysis"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--green)] transition hover:gap-3"
            >
              <ArrowLeft size={15} /> Back to all analysis
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-6">
            <KeyPointsBox />
            <SourcesBox />
            {article.summarize && <SummarizeBox summarize={article.summarize} />}
          </div>
        </div>
      </section>

      {related.length > 0 && <RelatedAnalysis articles={related} />}
      <ArticleContactCTA />
    </>
  );
}
