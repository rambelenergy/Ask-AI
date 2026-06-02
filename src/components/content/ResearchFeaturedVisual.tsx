export function ResearchFeaturedVisual() {
  return (
    <div className="relative min-h-[390px] bg-[var(--navy)]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 520 390" fill="none">
        <path d="M0 70 H520 M0 140 H520 M0 210 H520 M0 280 H520 M100 0 V390 M220 0 V390 M340 0 V390 M460 0 V390" stroke="#263d54" strokeWidth="1" />
        <path d="M72 310 C150 230 220 236 292 170 C355 112 420 102 484 60" stroke="var(--gold)" strokeWidth="4" strokeDasharray="12 10" />
        <circle cx="72" cy="310" r="8" fill="var(--gold)" />
        <circle cx="292" cy="170" r="8" fill="var(--green)" />
        <circle cx="484" cy="60" r="8" fill="var(--gold)" />
        <rect x="70" y="82" width="220" height="132" rx="4" fill="#ffffff" opacity="0.94" />
        <rect x="96" y="112" width="104" height="9" fill="var(--green)" />
        <rect x="96" y="142" width="150" height="7" fill="#cbd5e1" />
        <rect x="96" y="166" width="116" height="7" fill="#cbd5e1" />
        <rect x="96" y="190" width="82" height="7" fill="#cbd5e1" />
      </svg>
      <div className="absolute left-7 top-7 rounded-sm bg-white/95 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--navy)]">
        Research document visual
      </div>
    </div>
  );
}
