import Link from "next/link";
import type { ReactNode } from "react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "inverse";
  className?: string;
};

const variants = {
  primary: "bg-[var(--green)] text-white hover:bg-[#0e4b40]",
  secondary: "border border-[var(--line)] bg-[var(--paper)] text-[var(--navy)] hover:border-[#bccbc4]",
  inverse: "border border-white/30 bg-transparent text-white hover:border-white/60",
};

export function ButtonLink({ href, children, variant = "primary", className = "" }: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center px-6 py-4 text-sm font-semibold transition ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
