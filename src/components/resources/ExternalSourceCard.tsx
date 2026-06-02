import type { ExternalResource } from "@/types/resource";
import { ExternalLink, Globe } from "lucide-react";

type ExternalSourceCardProps = {
  resource: ExternalResource;
};

export function ExternalSourceCard({ resource }: ExternalSourceCardProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${resource.title} — ${resource.source} (opens in new tab)`}
      className="professional-card group flex h-full flex-col p-7"
    >
      {/* Badge + source */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="tag tag-navy">{resource.badge}</span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--green)]">
          <Globe size={12} />
          {resource.source}
        </span>
      </div>

      {/* Title */}
      <h3 className="flex-1 text-[1.1rem] font-bold leading-[1.3] tracking-[-0.015em] text-[var(--navy)] transition-colors duration-300 group-hover:text-[var(--green)]">
        {resource.title}
      </h3>

      {/* CTA */}
      <div className="mt-5 flex items-center gap-1.5 border-t border-[var(--line-soft)] pt-4 text-[13px] font-semibold text-[var(--green)] transition-all duration-300 group-hover:gap-2.5">
        View Source
        <ExternalLink size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}
