export function EnergyFocusHeroVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-60">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 540" fill="none">
        <defs>
          <pattern id="energy-grid" width="52" height="52" patternUnits="userSpaceOnUse">
            <path d="M 52 0 L 0 0 0 52" fill="none" stroke="var(--line)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1440" height="540" fill="url(#energy-grid)" opacity="0.55" />
        <circle cx="1130" cy="120" r="300" stroke="var(--green)" strokeWidth="1" opacity="0.16" />
        <circle cx="1130" cy="120" r="190" stroke="var(--gold)" strokeWidth="1" opacity="0.14" />
        <path
          d="M820 375 C910 305 970 260 1045 205 C1120 150 1210 125 1305 72"
          stroke="var(--gold)"
          strokeWidth="4"
          strokeDasharray="10 10"
        />
        <circle cx="820" cy="375" r="7" fill="var(--gold)" />
        <circle cx="1045" cy="205" r="7" fill="var(--green)" />
        <circle cx="1305" cy="72" r="7" fill="var(--gold)" />
      </svg>
    </div>
  );
}
