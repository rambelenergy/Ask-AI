import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { T } from "@/components/language/t";

type CTASectionProps = {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
};

export function CTASection({ title, description, buttonLabel, buttonHref }: CTASectionProps) {
  return (
    <section className="section-py">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-xl bg-[var(--navy)]">
          {/* Decorative accent */}
          <div className="absolute right-0 top-0 h-full w-1/3 opacity-[0.03]">
            <svg viewBox="0 0 400 300" className="h-full w-full" fill="none">
              <circle cx="380" cy="50" r="250" stroke="white" strokeWidth="1" />
              <circle cx="380" cy="50" r="180" stroke="white" strokeWidth="0.5" />
            </svg>
          </div>

          <div className="relative grid items-center gap-8 px-7 py-12 sm:px-12 lg:grid-cols-[1fr_auto] lg:px-14 lg:py-14">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 backdrop-blur-sm">
                <Mail size={13} className="text-[var(--gold)]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--gold)]">
                  <T k="home.cta.eyebrow" />
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight tracking-[-0.035em] text-white sm:text-[2.5rem]">
                {title}
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-[1.8] text-slate-300">
                {description}
              </p>
            </div>

            <Link
              href={buttonHref}
              className="btn-primary inline-flex h-fit items-center gap-2 bg-[var(--green)] px-7 py-4 text-sm font-semibold text-white hover:bg-[#0e4d42]"
            >
              {buttonLabel}
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
