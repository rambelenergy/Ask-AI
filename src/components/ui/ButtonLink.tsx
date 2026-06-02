import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type ButtonLinkProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "inverse";
  className?: string;
};

const variants = {
  primary:
    "bg-[var(--green)] text-white hover:bg-[#0e4d42] hover:shadow-lg hover:shadow-[var(--green)]/20",
  secondary:
    "border border-[var(--line)] bg-[var(--paper)] text-[var(--navy)] hover:border-[var(--green)]/30 hover:bg-[var(--surface)]",
  inverse:
    "border border-white/30 bg-transparent text-white hover:border-white/60 hover:bg-white/5",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-sm font-semibold transition-all duration-300 ${variants[variant]} ${className}`}
    >
      {children}
      <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-0.5" />
    </Link>
  );
}
