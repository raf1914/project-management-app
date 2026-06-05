export default function Loading() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-20 rounded bg-neon-cyan/20" />
      <div className="panel h-32 p-6">
        <div className="h-6 w-48 rounded bg-white/15" />
        <div className="mt-3 h-3 w-72 rounded bg-white/10" />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[0, 1, 2].map((col) => (
          <div key={col} className="rounded-xl border border-white/5 bg-white/[0.03] p-3">
            <div className="mb-3 h-4 w-24 rounded bg-neon-pink/20" />
            <div className="space-y-2">
              {[0, 1].map((card) => (
                <div
                  key={card}
                  className="h-20 rounded-lg border border-white/10 bg-[#0e0524]/60"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
