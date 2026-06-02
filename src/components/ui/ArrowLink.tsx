import Link from "next/link";

type ArrowLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function ArrowLink({ href, children }: ArrowLinkProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--green)] transition hover:gap-3">
      {children}
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.7">
        <path d="M2.5 8h10M8.5 3.75 12.75 8 8.5 12.25" />
      </svg>
    </Link>
  );
}
