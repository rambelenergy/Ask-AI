import { ButtonLink } from "@/components/ButtonLink";

type CTASectionProps = {
  title: string;
  description: string;
  buttonLabel: string;
  buttonHref: string;
};

export function CTASection({ title, description, buttonLabel, buttonHref }: CTASectionProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-page grid items-center gap-8 bg-[var(--navy)] px-7 py-12 text-white sm:px-12 lg:grid-cols-[1fr_auto] lg:px-14 lg:py-14">
        <div className="max-w-3xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--gold)]">Contact / Collaboration</p>
          <h2 className="text-3xl font-bold leading-tight tracking-[-0.035em] sm:text-[2.5rem]">{title}</h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">{description}</p>
        </div>
        <ButtonLink href={buttonHref} className="h-fit px-7">
          {buttonLabel}
        </ButtonLink>
      </div>
    </section>
  );
}
