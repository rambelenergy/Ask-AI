import type { Metadata } from "next";
import { CTASection } from "@/components/content/CTASection";
import { Mail, Globe, MapPin, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <>
      <section className="border-b border-[var(--line)] bg-white py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="max-w-2xl">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--green)]">Get in Touch</p>
            <h1 className="text-[2.8rem] font-bold leading-[1.04] tracking-[-0.05em] text-[var(--navy)] sm:text-[3.4rem]">
              Contact
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--muted)] sm:text-xl">
              For research inquiries, institutional discussions, or strategic energy collaboration, please reach out to RamBelEnergy.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20 lg:py-24">
        <div className="container-page">
          <div className="grid gap-8 lg:grid-cols-3">
            <ContactCard
              icon={Mail}
              title="Email"
              details={["contact@rambelenergy.com", "research@rambelenergy.com"]}
            />
            <ContactCard
              icon={Globe}
              title="Online"
              details={["rambelenergy.com", "Analysis & Research platform"]}
            />
            <ContactCard
              icon={MapPin}
              title="Location"
              details={["Algeria — Europe", "Mediterranean energy corridor"]}
            />
          </div>

          {/* Placeholder form area */}
          <div className="mt-16 rounded-2xl border border-[var(--line)] bg-white p-8 sm:p-12">
            <div className="mx-auto max-w-xl text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--green-soft)] text-[var(--green)]">
                <MessageSquare size={22} />
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[var(--navy)]">Send a Message</h2>
              <p className="mt-3 text-[15px] leading-7 text-[var(--muted)]">
                The contact form will be implemented in a forthcoming update. For now, please reach out via email.
              </p>
              <a
                href="mailto:contact@rambelenergy.com"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--green)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#0e4b40]"
              >
                <Mail size={16} />
                Email us directly
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTASection
        title="Research, Media & Strategic Energy Collaboration"
        description="For research inquiries, institutional discussions, or strategic energy collaboration, contact RamBelEnergy."
        buttonLabel="Back to Home"
        buttonHref="/"
      />
    </>
  );
}

function ContactCard({
  icon: Icon,
  title,
  details,
}: {
  icon: typeof Mail;
  title: string;
  details: string[];
}) {
  return (
    <div className="group rounded-xl border border-[var(--line)] bg-white p-7 transition hover:border-slate-300 hover:shadow-md">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--green-soft)] text-[var(--green)] transition group-hover:scale-105">
        <Icon size={20} />
      </div>
      <h3 className="text-base font-bold text-[var(--navy)]">{title}</h3>
      <div className="mt-3 space-y-1 text-[14px] leading-7 text-[var(--muted)]">
        {details.map((d) => (
          <p key={d}>{d}</p>
        ))}
      </div>
    </div>
  );
}
