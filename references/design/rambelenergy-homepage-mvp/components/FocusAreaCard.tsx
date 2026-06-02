import type { FocusArea } from "@/data/homepage";

type FocusAreaCardProps = {
  area: FocusArea;
};

export function FocusAreaCard({ area }: FocusAreaCardProps) {
  return (
    <article className="group flex min-h-[144px] items-start justify-between gap-6 border border-[var(--line)] bg-[var(--paper)] p-6 transition hover:border-[#b8c8c1]">
      <div>
        <h3 className="text-lg font-bold text-[var(--navy)]">{area.title}</h3>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{area.description}</p>
      </div>
      <span aria-hidden="true" className="mt-1 text-2xl text-[var(--green)] transition group-hover:translate-x-1">→</span>
    </article>
  );
}
