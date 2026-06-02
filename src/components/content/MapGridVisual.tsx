export function MapGridVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-70">
      <div className="absolute right-[-80px] top-[-120px] h-[440px] w-[440px] rounded-full border border-[var(--gold)]/30" />
      <div className="absolute right-[110px] top-[80px] h-[260px] w-[260px] rounded-full border border-[var(--green)]/20" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 520" fill="none">
        <defs>
          <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="var(--line)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="1440" height="520" fill="url(#grid)" opacity="0.5" />
        <path
          d="M820 360 C900 280 980 250 1060 180 C1130 120 1205 105 1290 70"
          stroke="var(--gold)"
          strokeWidth="4"
          strokeDasharray="10 10"
        />
        <circle cx="820" cy="360" r="7" fill="var(--gold)" />
        <circle cx="1060" cy="180" r="7" fill="var(--green)" />
        <circle cx="1290" cy="70" r="7" fill="var(--gold)" />
      </svg>
    </div>
  );
}
