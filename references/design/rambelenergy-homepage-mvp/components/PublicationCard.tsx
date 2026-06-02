import type { Publication } from "@/data/homepage";
import { ArrowLink } from "./ArrowLink";

type PublicationCardProps = {
  publication: Publication;
};

export function PublicationCard({ publication }: PublicationCardProps) {
  return (
    <article className="flex h-full flex-col border-t-2 border-t-[var(--green)] bg-white p-7 editorial-shadow">
      <div className="mb-5 flex items-center justify-between gap-3 text-xs font-bold uppercase tracking-[0.15em]">
        <span className="text-[var(--green)]">{publication.type}</span>
        <time className="text-slate-400">{publication.date}</time>
      </div>
      <h3 className="text-xl font-bold leading-tight tracking-[-0.025em] text-[var(--navy)]">{publication.title}</h3>
      <p className="mb-7 mt-4 flex-1 text-sm leading-7 text-[var(--muted)]">{publication.description}</p>
      <ArrowLink href={publication.href}>View publication</ArrowLink>
    </article>
  );
}
