export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-20 rounded bg-slate-200" />
      <div className="h-32 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="h-6 w-48 rounded bg-slate-200" />
        <div className="mt-3 h-3 w-72 rounded bg-slate-100" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((col) => (
          <div key={col} className="rounded-xl bg-slate-50/80 p-3">
            <div className="mb-3 h-4 w-24 rounded bg-slate-200" />
            <div className="space-y-2">
              {[0, 1].map((card) => (
                <div
                  key={card}
                  className="h-20 rounded-lg border border-slate-200 bg-white"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
