import type { MissionPoint as MissionPointContent } from "@/data/about";

type MissionPointProps = {
  point: MissionPointContent;
  index: number;
};

export function MissionPoint({ point, index }: MissionPointProps) {
  return (
    <article className="border-b border-[var(--line)] py-5 first:pt-0 last:border-0 last:pb-0">
      <div className="flex gap-5">
        <span className="mt-0.5 text-xs font-bold tracking-[0.18em] text-[var(--gold)]">0{index + 1}</span>
        <div>
          <h3 className="text-base font-bold text-[var(--navy)]">{point.title}</h3>
          <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{point.description}</p>
        </div>
      </div>
    </article>
  );
}
