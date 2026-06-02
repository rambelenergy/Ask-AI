import type { CoreFocusItem } from "@/data/about";

type CoreFocusCardProps = {
  item: CoreFocusItem;
};

function FocusMarker({ marker }: Pick<CoreFocusItem, "marker">) {
  if (marker === "pipeline") {
    return (
      <svg viewBox="0 0 42 42" aria-hidden="true" className="h-11 w-11 text-[var(--green)]">
        <path d="M6 29 16 19l8 6L36 12" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="6" cy="29" r="3" fill="var(--gold)" /><circle cx="36" cy="12" r="3" fill="var(--gold)" />
      </svg>
    );
  }
  if (marker === "solar") {
    return (
      <svg viewBox="0 0 42 42" aria-hidden="true" className="h-11 w-11">
        <circle cx="21" cy="18" r="8" fill="var(--gold)" />
        <path d="M9 34h24M13 28h16" stroke="var(--green)" strokeWidth="2" />
      </svg>
    );
  }
  if (marker === "security") {
    return (
      <svg viewBox="0 0 42 42" aria-hidden="true" className="h-11 w-11 text-[var(--green)]">
        <path d="M21 5 34 11v9c0 9-6 14-13 17-7-3-13-8-13-17v-9l13-6Z" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 42 42" aria-hidden="true" className="h-11 w-11">
      <rect x="7" y="7" width="12" height="12" fill="var(--green)" /><rect x="23" y="7" width="12" height="12" fill="var(--gold)" />
      <rect x="7" y="23" width="12" height="12" fill="var(--gold)" /><rect x="23" y="23" width="12" height="12" fill="var(--green)" />
    </svg>
  );
}

export function CoreFocusCard({ item }: CoreFocusCardProps) {
  return (
    <article className="border border-[var(--line)] bg-white p-6 sm:p-7">
      <div className="mb-7 flex h-14 w-14 items-center justify-center border border-[var(--line)] bg-[var(--green-soft)]">
        <FocusMarker marker={item.marker} />
      </div>
      <h3 className="text-xl font-bold leading-tight text-[var(--navy)]">{item.title}</h3>
      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.description}</p>
    </article>
  );
}
