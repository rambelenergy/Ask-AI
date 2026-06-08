import Link from "next/link";
import { saharaSectionContent } from "@/data/renewable-energy-sources";
import { Sun, ArrowRight } from "lucide-react";

export function SaharaRenewableSection() {
  return (
    <section className="section-light section-py" id="solar-hydrogen">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Left: Text content */}
          <div className="order-2 lg:order-1">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--green)]/20 bg-[var(--green-soft)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--green)]">
              <Sun size={13} />
              {saharaSectionContent.eyebrow}
            </span>

            <h2 className="heading-lg mt-4">
              {saharaSectionContent.title}
            </h2>

            <p className="body-lg mt-6">
              {saharaSectionContent.description}
            </p>

            <Link
              href="#renewable-sources"
              className="btn-primary mt-8 inline-flex items-center gap-2.5"
            >
              {saharaSectionContent.ctaLabel}
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Right: Sahara image */}
          <div className="order-1 lg:order-2">
            <div className="relative overflow-hidden rounded-xl border border-[var(--line)]">
              <img
                src="/sahara-energy.jpeg"
                alt="Sahara desert solar energy potential"
                className="h-[340px] w-full object-cover sm:h-[420px]"
                loading="lazy"
                decoding="async"
              />
              {/* Labels overlay */}
              <div className="absolute bottom-5 left-5 z-10">
                <div className="rounded-lg bg-white/90 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--navy)] shadow-sm backdrop-blur-sm">
                  Algerian Sahara
                </div>
              </div>
              <div className="absolute right-5 top-5 z-10">
                <div className="rounded-lg bg-[var(--green)]/10 px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                  Renewable Hub
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
