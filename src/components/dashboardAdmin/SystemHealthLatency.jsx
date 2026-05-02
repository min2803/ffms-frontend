export default function SystemHealthLatency({ data = [] }) {
  const max = Math.max(...data, 1);

  return (
    <div className="rounded-lg border border-border-default bg-bg-surface p-6 shadow-soft h-full flex flex-col">
      <h2 className="text-sm font-bold text-text-primary mb-6">Real-time Performance Latency</h2>

      <div className="flex-1 flex items-end justify-between gap-1.5 sm:gap-3">
        {data.map((value, i) => {
          const heightPercent = (value / max) * 100;
          const isHighlighted = i === 5;

          return (
            <div
              key={i}
              className={`w-full max-w-[20px] rounded-t-sm transition-all duration-300 ${
                isHighlighted ? "bg-[#0ea5e9]" : "bg-[#cbd5e1] hover:bg-[#94a3b8]"
              }`}
              style={{ height: `${heightPercent}%` }}
              title={`${value}ms`}
            />
          );
        })}
      </div>

      <div className="flex justify-between mt-4 text-xs font-semibold text-text-secondary">
        <span>14:00</span>
        <span>14:15</span>
        <span>14:30</span>
        <span>14:45</span>
      </div>
    </div>
  );
}
