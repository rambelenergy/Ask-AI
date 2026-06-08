import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { T } from "@/components/language/t";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumb mb-6">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={index} className="flex items-center gap-0">
            {isLast ? (
              <span className="current">{item.label}</span>
            ) : item.href ? (
              <>
                <Link href={item.href}>{item.label}</Link>
                <ChevronRight size={14} className="mx-1 text-[var(--line)]" />
              </>
            ) : (
              <>
                <span>{item.label}</span>
                <ChevronRight size={14} className="mx-1 text-[var(--line)]" />
              </>
            )}
          </span>
        );
      })}
    </nav>
  );
}

/** Pre-built breadcrumbs for each page */
export function HomeBreadcrumb() {
  return (
    <Breadcrumb
      items={[{ label: "Home", href: "/" }, { label: "Home" }]}
    />
  );
}

export function AboutBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "/" },
        { label: "About" },
      ]}
    />
  );
}

export function AnalysisBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "/" },
        { label: "Analysis" },
      ]}
    />
  );
}

export function ResearchBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "/" },
        { label: "Research" },
      ]}
    />
  );
}

export function ContactBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "/" },
        { label: "Contact" },
      ]}
    />
  );
}

export function EnergyFocusBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "/" },
        { label: "Energy Focus" },
      ]}
    />
  );
}

export function GlobalMapBreadcrumb() {
  return (
    <Breadcrumb
      items={[
        { label: "Home", href: "/" },
        { label: "Global Map" },
      ]}
    />
  );
}
