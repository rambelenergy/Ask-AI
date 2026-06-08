import type { Metadata } from "next";
import Link from "next/link";
import { RelatedAnalysis } from "@/components/content/RelatedAnalysis";
import { SummarizeBox } from "@/components/content/SummarizeBox";
import { ArticleContactCTA } from "@/components/content/ArticleContactCTA";
import { getPublicationBySlug, getRelatedPublications } from "@/lib/publications";
import { Calendar, User, Tag, Globe, ArrowLeft, Download, ExternalLink, BookOpen } from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pub = await getPublicationBySlug(slug);
  return { title: pub?.title || slug.replace(/-/g, " ") };
}

export default async function ResearchDetailPage({ params }: Props) {
  const { slug } = await params;
  const pub = await getPublicationBySlug(slug);

  if (!pub) {
    return (
      <section className="container-page py-24">
        <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-2 text-[13px] font-medium text-[var(--green)]">
          <Link href="/" className="transition hover:text-[var(--navy)]">Home</Link>
          <span className="text-slate-300">/</span>
          <Link href="/research" className="transition hover:text-[var(--navy)]">Research</Link>
          <span className="text-slate-300">/</span>
          <span aria-current="page" className="text-[var(--muted)]">Not Found</span>
        </nav>
        <h1 className="text-3xl font-bold text-[var(--navy)]">Publication not found</h1>
        <p className="mt-3 text-lg text-[var(--muted)]">This publication does not exist or has not been published.</p>
        <Link href="/research" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--green)]">
          <ArrowLeft size={15} /> Back to Research
        </Link>
      </section>
    );
  }

  const related = await getRelatedPublications(slug, pub.category);
  const formattedDate = pub.published_at
    ? new Date(pub.published_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <>
      {/* Hero section with metadata */}
      <section className="border-b border-[var(--line)] bg-white">
        <div className="container-page py-16 sm:py-20">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[13px] font-medium text-[var(--green)]">
            <Link href="/" className="transition hover:text-[var(--navy)]">Home</Link>
            <span className="text-slate-300">/</span>
            <Link href="/research" className="transition hover:text-[var(--navy)]">Research</Link>
            <span className="text-slate-300">/</span>
            <span aria-current="page" className="text-[var(--muted)] break-words">{pub.title}</span>
          </nav>

          {/* Type badge */}
          {pub.pub_type && (
            <div className="mb-5">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--green-soft)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-[var(--green)]">
                <BookOpen size={12} />
                {pub.pub_type}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="max-w-[860px] break-words text-[1.7rem] font-bold leading-[1.12] tracking-[-0.03em] text-[var(--navy)] sm:text-[2.2rem] lg:text-[2.8rem]">
            {pub.title}
          </h1>

          {/* Excerpt */}
          {pub.excerpt && (
            <p className="mt-5 max-w-[800px] text-lg leading-[1.7] text-[var(--muted)] sm:text-xl">
              {pub.excerpt}
            </p>
          )}

          {/* Metadata bar */}
          <div className="mt-6 flex flex-wrap items-center gap-5 border-y border-[var(--line)] py-4 text-[13px] text-[var(--muted)]">
            {pub.author && (
              <div className="flex items-center gap-2">
                <User size={14} className="text-slate-400" />
                <span className="font-medium">{pub.author}</span>
              </div>
            )}
            {pub.category && (
              <div className="flex items-center gap-2">
                <Tag size={14} className="text-slate-400" />
                <span>{pub.category}</span>
              </div>
            )}
            {pub.region && (
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-slate-400" />
                <span>{pub.region}</span>
              </div>
            )}
            {formattedDate && (
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span>{formattedDate}</span>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            {pub.file_url && (
              <a
                href={pub.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--green)] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0e4b40] hover:shadow-md"
              >
                <Download size={15} />
                Download PDF
              </a>
            )}
            {pub.external_url && (
              <a
                href={pub.external_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--green)] px-5 py-2.5 text-[13px] font-semibold text-[var(--green)] transition hover:bg-[var(--green-soft)]"
              >
                <ExternalLink size={15} />
                View Source
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Cover image */}
      {pub.cover_image_url && (
        <div className="container-page py-10">
          <div className="overflow-hidden rounded-xl border border-[var(--line)] shadow-sm">
            <img
              src={pub.cover_image_url}
              alt={pub.title}
              className="h-[200px] w-full object-cover sm:h-[340px] lg:h-[420px]"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      )}

      {/* Content + sidebar layout */}
      <section className="container-page grid gap-8 pb-16 pt-6 sm:pt-8 lg:grid-cols-12 lg:gap-12 lg:pb-20">
        <div className="lg:col-span-8">
          {pub.body_html && (
            <div
              className="article-body mt-8 text-[16px] leading-[1.8] text-slate-700 sm:mt-10 sm:text-[17px]"
              dangerouslySetInnerHTML={{ __html: pub.body_html }}
            />
          )}

          {/* Bottom nav */}
          <div className="mt-12 border-t border-[var(--line)] pt-8">
            <Link
              href="/research"
              className="inline-flex items-center gap-2 text-[13px] font-semibold text-[var(--green)] transition hover:gap-3"
            >
              <ArrowLeft size={15} /> Back to all research
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Publication info card */}
            <div className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-sm">
              <h3 className="mb-5 text-[12px] font-bold uppercase tracking-[0.14em] text-slate-500">Publication Details</h3>
              <div className="space-y-4">
                {pub.pub_type && (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">Type</span>
                    <span className="rounded-full bg-[var(--green-soft)] px-3 py-1 text-[11px] font-semibold text-[var(--green)]">
                      {pub.pub_type}
                    </span>
                  </div>
                )}
                {pub.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">Category</span>
                    <span className="text-[13px] font-medium text-[var(--navy)]">{pub.category}</span>
                  </div>
                )}
                {pub.region && (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">Region</span>
                    <span className="text-[13px] font-medium text-[var(--navy)]">{pub.region}</span>
                  </div>
                )}
                {pub.author && (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">Author</span>
                    <span className="text-[13px] font-medium text-[var(--navy)]">{pub.author}</span>
                  </div>
                )}
                {formattedDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] text-slate-500">Published</span>
                    <span className="text-[13px] font-medium text-[var(--navy)]">{formattedDate}</span>
                  </div>
                )}
              </div>

              {/* Quick actions in sidebar */}
              <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">
                {pub.file_url && (
                  <a
                    href={pub.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--green)] py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#0e4b40]"
                  >
                    <Download size={14} /> Download
                  </a>
                )}
                {pub.external_url && (
                  <a
                    href={pub.external_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-[13px] font-semibold text-[var(--navy)] transition hover:bg-slate-50"
                  >
                    <ExternalLink size={14} /> View Source
                  </a>
                )}
              </div>
            </div>

            {pub.summarize && <SummarizeBox summarize={pub.summarize} />}
          </div>
        </div>
      </section>

      {/* Related publications */}
      {related.length > 0 && (
        <section className="border-t border-[var(--line)] bg-[#f6f8f7] py-20">
          <div className="container-page">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--green)]">Related Publications</div>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--navy)] sm:text-4xl">Continue reading</h2>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <article key={item.id} className="group flex h-full flex-col rounded-xl border border-[var(--line)] bg-white p-7 transition hover:border-slate-300 hover:shadow-md">
                  {item.pub_type && (
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--green-soft)] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">
                        <BookOpen size={10} />
                        {item.pub_type}
                      </span>
                    </div>
                  )}
                  <Link href={`/research/${item.slug}`}>
                    <h3 className="text-[1.15rem] font-bold leading-[1.25] tracking-[-0.02em] text-[var(--navy)] transition-colors group-hover:text-[var(--green)]">
                      {item.title}
                    </h3>
                  </Link>
                  <p className="mb-6 mt-3 flex-1 text-[14px] leading-[1.7] text-[var(--muted)] line-clamp-3">
                    {item.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--green)] transition-all group-hover:gap-2.5">
                    Read more
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
                      <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                    </svg>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <ArticleContactCTA />
    </>
  );
}
