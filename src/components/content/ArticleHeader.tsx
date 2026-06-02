import Link from "next/link";
import { Clock3, CalendarDays, UserCircle, FileText } from "lucide-react";

type ArticleHeaderProps = {
  category: string;
  title: string;
  subtitle: string;
};

export function ArticleHeader({ category, title, subtitle }: ArticleHeaderProps) {
  return (
    <section className="border-b border-[var(--line)] bg-white">
      <div className="container-page py-16">
        <nav aria-label="Breadcrumb" className="mb-10 text-sm font-semibold text-[var(--green)]">
          <Link href="/" className="transition hover:text-[var(--navy)]">Home</Link>
          <span className="mx-2 text-slate-300">/</span>
          <Link href="/analysis" className="transition hover:text-[var(--navy)]">Analysis</Link>
          <span className="mx-2 text-slate-300">/</span>
          <span aria-current="page">Article</span>
        </nav>

        <div className="max-w-[980px]">
          <div className="mb-6 inline-flex rounded-sm bg-[var(--green-soft)] px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--green)]">
            {category}
          </div>
          <h1 className="text-[64px] font-bold leading-[1.02] tracking-[-0.045em] text-[var(--navy)]">
            {title}
          </h1>
          <p className="mt-8 max-w-[900px] text-[23px] leading-10 text-[var(--muted)]">
            {subtitle}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 border-t border-[var(--line)] pt-7 text-sm text-[var(--muted)]">
          <div className="flex items-center gap-2">
            <UserCircle size={20} className="text-[var(--green)]" />
            <span className="font-semibold text-[var(--navy)]">Mr. Ramdane</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-[var(--green)]" />
            <span>May 17, 2026</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-[var(--green)]" />
            <span>8 min read</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[var(--green)]" />
            <span>Source-informed strategic analysis</span>
          </div>
        </div>
      </div>
    </section>
  );
}
