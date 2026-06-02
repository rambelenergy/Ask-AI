import type { EditorialValue } from "@/data/about";

type EditorialValueCardProps = {
  value: EditorialValue;
  index: number;
};

export function EditorialValueCard({ value, index }: EditorialValueCardProps) {
  return (
    <article className="relative border border-[var(--line)] bg-[var(--paper)] p-6 pt-8">
      <span aria-hidden="true" className={`absolute inset-x-0 top-0 h-1 ${index % 2 === 0 ? "bg-[var(--green)]" : "bg-[var(--gold)]"}`} />
      <h3 className="text-lg font-bold text-[var(--navy)]">{value.title}</h3>
      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{value.description}</p>
    </article>
  );
}
