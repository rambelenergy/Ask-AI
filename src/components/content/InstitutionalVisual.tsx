import { Brain } from "lucide-react";

export function InstitutionalVisual() {
  return (
    <div className="relative h-[430px] overflow-hidden border border-slate-200 bg-[var(--navy)]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 560 430" fill="none">
        <defs>
          <pattern id="ai-grid" width="42" height="42" patternUnits="userSpaceOnUse">
            <path d="M 42 0 L 0 0 0 42" fill="none" stroke="#233a50" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="560" height="430" fill="url(#ai-grid)" opacity="0.85" />
        <path
          d="M82 324 C156 254 210 250 286 188 C352 134 416 122 498 76"
          stroke="var(--gold)"
          strokeWidth="4"
          strokeDasharray="11 10"
        />
        <circle cx="82" cy="324" r="8" fill="var(--gold)" />
        <circle cx="286" cy="188" r="8" fill="var(--green)" />
        <circle cx="498" cy="76" r="8" fill="var(--gold)" />
        <rect x="78" y="92" width="178" height="124" rx="4" fill="#ffffff" opacity="0.96" />
        <rect x="100" y="118" width="96" height="8" fill="var(--green)" opacity="0.85" />
        <rect x="100" y="144" width="120" height="7" fill="#cbd5e1" />
        <rect x="100" y="164" width="100" height="7" fill="#cbd5e1" />
        <rect x="100" y="184" width="82" height="7" fill="#cbd5e1" />
        <rect x="324" y="234" width="150" height="96" rx="4" fill="#ffffff" opacity="0.94" />
        <rect x="346" y="258" width="88" height="7" fill="var(--gold)" />
        <rect x="346" y="282" width="102" height="6" fill="#cbd5e1" />
        <rect x="346" y="300" width="70" height="6" fill="#cbd5e1" />
      </svg>

      <div className="absolute left-8 top-8 rounded-sm bg-white/95 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-[var(--navy)]">
        Document + map intelligence
      </div>

      <div className="absolute bottom-8 left-8 right-8 border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
        <div className="mb-2 flex items-center gap-3 text-sm font-semibold text-[var(--gold)]">
          <Brain size={18} /> Future AI knowledge base
        </div>
        <p className="text-sm leading-6 text-slate-300">
          A restrained AI preview focused on source-based research, energy policy documents, and strategic context.
        </p>
      </div>
    </div>
  );
}
