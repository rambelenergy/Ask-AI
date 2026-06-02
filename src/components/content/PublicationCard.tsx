import type { Publication } from "@/data/homepage";
import { ArrowLink } from "@/components/ui/ArrowLink";
import { ArrowRight } from "lucide-react";

type PublicationCardProps = {
  publication: Publication;
};

export function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <article className="professional-card group flex h-full flex-col overflow-hidden border-t-[3px] border-t-[var(--green)] p-7">
      {/* Meta row */}
      <div className="mb-5 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.15em]">
        <span className="tag tag-green">{publication.type}</span>
        <time className="text-slate-400">{publication.date}</time>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold leading-tight tracking-[-0.025em] text-[var(--navy)] transition-colors duration-300 group-hover:text-[var(--green)]">
        {publication.title}
      </h3>

      {/* Description */}
      <p className="mb-7 mt-4 flex-1 text-sm leading-7 text-[var(--muted)]">
        {publication.description}
      </p>

      {/* View link */}
      <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[var(--green)] transition-all duration-300 group-hover:gap-2.5">
        View publication
        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </article>
  );
}
