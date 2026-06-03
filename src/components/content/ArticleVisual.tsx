import { Route } from "lucide-react";

export function ArticleVisual() {
  return (
    <div className="relative z-0 h-[280px] overflow-hidden border border-slate-200 bg-[var(--navy)] sm:h-[400px] lg:h-[520px]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1296 520" fill="none">
        <defs>
          <pattern id="article-grid" width="56" height="56" patternUnits="userSpaceOnUse">
            <path d="M 56 0 L 0 0 0 56" fill="none" stroke="#253b52" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1296" height="520" fill="url(#article-grid)" opacity="0.9" />
        <circle cx="970" cy="120" r="260" stroke="var(--green)" strokeWidth="1" opacity="0.45" />
        <circle cx="970" cy="120" r="170" stroke="var(--gold)" strokeWidth="1" opacity="0.28" />
        <path
          d="M190 410 C310 310 430 315 560 235 C690 155 810 155 932 106 C1010 74 1088 60 1180 42"
          stroke="var(--gold)"
          strokeWidth="5"
          strokeDasharray="14 12"
        />
        <circle cx="190" cy="410" r="10" fill="var(--gold)" />
        <circle cx="560" cy="235" r="10" fill="var(--green)" />
        <circle cx="932" cy="106" r="10" fill="var(--gold)" />
        <circle cx="1180" cy="42" r="10" fill="var(--green)" />
        <rect x="134" y="122" width="260" height="160" rx="4" fill="#ffffff" opacity="0.94" />
        <rect x="166" y="154" width="118" height="10" fill="var(--green)" />
        <rect x="166" y="188" width="176" height="8" fill="#cbd5e1" />
        <rect x="166" y="216" width="142" height="8" fill="#cbd5e1" />
        <rect x="166" y="244" width="94" height="8" fill="#cbd5e1" />
        <rect x="780" y="310" width="300" height="110" rx="4" fill="#ffffff" opacity="0.08" stroke="#ffffff" strokeOpacity="0.16" />
        <path d="M820 370 H1040" stroke="var(--gold)" strokeWidth="3" />
      </svg>

      <div className="absolute left-4 top-4 rounded-sm bg-white/95 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--navy)] sm:left-8 sm:top-8 sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.16em]">
        Abstract pipeline and Mediterranean route visual
      </div>
      <div className="absolute bottom-4 left-4 right-4 max-w-[620px] border border-white/10 bg-white/[0.06] p-4 backdrop-blur-sm sm:bottom-8 sm:left-8 sm:p-6">
        <div className="mb-3 flex items-center gap-3 text-sm font-semibold text-[var(--gold)]">
          <Route size={19} /> Strategic energy corridor
        </div>
        <p className="text-sm leading-7 text-slate-300">
          Visual placeholder for a serious editorial image: pipeline route, Algeria&ndash;Europe energy map, infrastructure network, or Mediterranean energy corridor.
        </p>
      </div>
    </div>
  );
}
