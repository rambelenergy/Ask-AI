export default function ResearchLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="border-b border-slate-100 bg-white py-24">
        <div className="container-page">
          <div className="mb-7 h-4 w-24 rounded bg-slate-100" />
          <div className="h-16 w-[500px] rounded bg-slate-100" />
          <div className="mt-8 h-12 w-full max-w-[850px] rounded bg-slate-100" />
        </div>
      </div>

      {/* Publications grid skeleton */}
      <div className="container-page py-20">
        <div className="mb-10 h-5 w-40 rounded bg-slate-100" />
        <div className="mb-6 h-8 w-80 rounded bg-slate-100" />
        <div className="grid gap-7 lg:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[320px] rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
