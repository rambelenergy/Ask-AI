export default function AnalysisLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="border-b border-slate-100 bg-white py-24">
        <div className="container-page">
          <div className="mb-7 h-4 w-24 rounded bg-slate-100" />
          <div className="h-16 w-96 rounded bg-slate-100" />
          <div className="mt-8 h-12 w-full max-w-[720px] rounded bg-slate-100" />
        </div>
      </div>

      {/* Featured skeleton */}
      <div className="container-page py-20">
        <div className="mb-9 h-5 w-40 rounded bg-slate-100" />
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7">
            <div className="h-[520px] rounded-xl bg-slate-100" />
          </div>
          <div className="col-span-12 grid gap-5 lg:col-span-5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[180px] rounded-xl bg-slate-100" />
            ))}
          </div>
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="container-page pb-20">
        <div className="mb-10 h-5 w-24 rounded bg-slate-100" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[330px] rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
