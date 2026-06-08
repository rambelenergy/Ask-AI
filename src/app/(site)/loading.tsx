export default function HomeLoading() {
  return (
    <div className="animate-pulse">
      {/* Ask Energy skeleton */}
      <div className="container-page py-10">
        <div className="mx-auto max-w-[680px]">
          <div className="h-[420px] rounded-2xl bg-slate-100" />
        </div>
      </div>

      {/* Slogan skeleton */}
      <div className="border-y border-slate-100 bg-white py-16">
        <div className="container-page flex justify-center">
          <div className="h-8 w-3/4 rounded bg-slate-100" />
        </div>
      </div>

      {/* Analysis section skeleton */}
      <div className="container-page py-20">
        <div className="mb-10 h-4 w-40 rounded bg-slate-100" />
        <div className="mb-6 h-8 w-80 rounded bg-slate-100" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-[320px] rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>

      {/* Solar map skeleton */}
      <div className="container-page pb-20">
        <div className="h-[240px] rounded-xl bg-slate-100" />
      </div>

      {/* Sahara skeleton */}
      <div className="container-page pb-20">
        <div className="h-[420px] rounded-xl bg-slate-100" />
      </div>

      {/* Energy development skeleton */}
      <div className="container-page pb-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <div className="mb-4 h-5 w-56 rounded bg-slate-100" />
            <div className="mb-3 h-8 w-72 rounded bg-slate-100" />
            <div className="h-20 w-full rounded bg-slate-100" />
          </div>
          <div className="h-[280px] rounded-xl bg-slate-100" />
        </div>
      </div>

      {/* About skeleton */}
      <div className="container-page pb-20">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="aspect-[3/4] max-h-[520px] rounded-xl bg-slate-100" />
          <div>
            <div className="mb-4 h-5 w-40 rounded bg-slate-100" />
            <div className="mb-6 h-8 w-64 rounded bg-slate-100" />
            <div className="h-32 w-full rounded bg-slate-100" />
          </div>
        </div>
      </div>

      {/* Focus areas skeleton */}
      <div className="container-page pb-20">
        <div className="mb-12 h-5 w-32 rounded bg-slate-100" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[180px] rounded-xl bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
