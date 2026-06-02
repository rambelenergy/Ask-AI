import Image from "next/image";

export function HeroRouteVisual() {
  return (
    <div className="relative min-h-[400px] overflow-hidden rounded-lg border border-white/10 bg-[var(--navy-soft)] sm:min-h-[480px]">
      <Image
        src="/hero-energy-route.svg"
        alt="Abstract energy corridor route connecting Nigeria, Algeria, Italy and Spain"
        fill
        priority
        className="object-cover opacity-90"
      />
      {/* Overlay info card */}
      <div className="absolute inset-x-5 bottom-5 rounded-lg border border-white/10 bg-[var(--navy)]/80 p-4 backdrop-blur-md sm:inset-x-7 sm:bottom-7 sm:p-5">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">
          Strategic corridor visual
        </p>
        <div className="mt-2.5 flex items-center gap-3 text-sm text-slate-200">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
            Nigeria
          </span>
          <span className="text-white/20">→</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--green)]" />
            Algeria
          </span>
          <span className="text-white/20">→</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--gold)]" />
            Italy / Spain
          </span>
        </div>
      </div>
    </div>
  );
}
