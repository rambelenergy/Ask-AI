import type { FocusArea } from "@/data/homepage";
import { ArrowRight } from "lucide-react";

type FocusAreaCardProps = {
  area: FocusArea;
  href?: string;
};

export function FocusAreaCard({ area, href }: FocusAreaCardProps) {
  const Wrapper = href ? "a" : "article";
  const wrapperProps = href
    ? { href, className: "professional-card group flex min-h-[160px] items-start justify-between gap-6 p-6" }
    : { className: "professional-card group flex min-h-[160px] items-start justify-between gap-6 p-6" };

  return (
    <Wrapper {...wrapperProps}>
      <div>
        <h3 className="text-lg font-bold text-[var(--navy)] transition-colors duration-300 group-hover:text-[var(--green)]">
          {area.title}
        </h3>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{area.description}</p>
      </div>
      <ArrowRight
        size={20}
        className="mt-1 shrink-0 text-[var(--green)] transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--navy)]"
      />
    </Wrapper>
  );
}
