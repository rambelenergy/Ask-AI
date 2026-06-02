import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "split" | "left";
};

export function SectionHeading({ eyebrow, title, description, align = "split" }: SectionHeadingProps) {
  return (
    <div className={`${align === "split" && description ? "grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end" : "max-w-3xl"}`}>
      <div>
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.19em] text-[var(--green)]">{eyebrow}</p>
        <h2 className="text-3xl font-bold leading-tight tracking-[-0.035em] text-[var(--navy)] sm:text-[2.5rem]">{title}</h2>
      </div>
      {description && <p className="text-base leading-8 text-[var(--muted)] sm:text-[1.03rem]">{description}</p>}
    </div>
  );
}
