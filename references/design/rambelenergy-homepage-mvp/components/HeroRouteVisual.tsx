import Image from "next/image";

export function HeroRouteVisual() {
  return (
    <div className="relative min-h-[420px] overflow-hidden border border-white/10 bg-[var(--navy-soft)] sm:min-h-[500px]">
      <Image
        src="/hero-energy-route.svg"
        alt="Abstract energy corridor route connecting Nigeria, Algeria, Italy and Spain"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-x-6 bottom-6 border border-white/10 bg-[var(--navy)]/75 p-5 backdrop-blur-sm sm:inset-x-8">
        <p className="text-[0.67rem] font-bold uppercase tracking-[0.18em] text-[var(--gold)]">Strategic corridor visual</p>
        <p className="mt-3 text-sm leading-6 text-slate-200">Nigeria → Algeria → Italy / Spain</p>
      </div>
    </div>
  );
}
