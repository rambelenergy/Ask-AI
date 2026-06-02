export function AboutHeroVisual() {
  return (
    <div className="relative min-h-[390px] overflow-hidden border border-white/10 bg-[var(--navy-soft)] sm:min-h-[460px]" aria-label="Abstract Algeria and Europe energy research visual" role="img">
      <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 600 470" fill="none">
        <defs>
          <pattern id="about-grid" width="45" height="45" patternUnits="userSpaceOnUse">
            <path d="M45 0H0V45" stroke="#365065" strokeWidth="1" opacity=".45" />
          </pattern>
        </defs>
        <rect width="600" height="470" fill="url(#about-grid)" />
        <circle cx="475" cy="92" r="218" stroke="#3e685f" opacity=".4" />
        <circle cx="475" cy="92" r="144" stroke="#b48842" opacity=".27" />
        <path d="M75 376C145 306 205 296 276 235C345 176 406 159 512 94" stroke="#b48842" strokeWidth="3.5" strokeDasharray="10 9" />
        <circle cx="75" cy="376" r="8" fill="#b48842" />
        <circle cx="276" cy="235" r="8" fill="#13584d" />
        <circle cx="512" cy="94" r="8" fill="#b48842" />
        <rect x="54" y="72" width="224" height="130" fill="#fffefc" opacity=".95" />
        <rect x="78" y="99" width="96" height="8" fill="#13584d" />
        <rect x="78" y="127" width="158" height="7" fill="#cad3d0" />
        <rect x="78" y="150" width="128" height="7" fill="#cad3d0" />
        <rect x="78" y="173" width="82" height="7" fill="#cad3d0" />
      </svg>
      <div className="absolute inset-x-6 bottom-6 border border-white/10 bg-[#0c2135]/85 p-5 sm:inset-x-8 sm:bottom-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--gold)]">Research & strategic context</p>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Energy routes, policy material, and Mediterranean cooperation represented through a restrained institutional visual.
        </p>
      </div>
    </div>
  );
}
