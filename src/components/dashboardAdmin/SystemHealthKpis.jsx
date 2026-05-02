import { Server, Activity, Database } from "lucide-react";

export default function SystemHealthKpis({ data }) {
  const cpuUsage = data?.cpuUsage ?? "—";
  const cpuLoad = data?.cpuLoad ?? null;
  const avgResponseTime = data?.avgResponseTime != null ? `${data.avgResponseTime}ms` : "—";
  const memoryPct = data?.memoryUsage?.percentage ?? null;
  const memoryPctNum = memoryPct != null ? parseFloat(memoryPct) : null;
  const dbConnections = data?.dbConnections != null ? data.dbConnections.toLocaleString() : "—";
  const dbCapacityPct = data?.dbCapacityPct ?? null;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-soft">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e0f2f1] text-[#00897b]">
            <Server size={20} />
          </div>
          <div className="rounded-full bg-[#e0f2f1] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#00897b]">
            HEALTHY
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            SERVER STATUS
          </p>
          <p className="mt-1 text-3xl font-bold text-text-primary">{cpuUsage}</p>
        </div>
        <div className="mt-6 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Load</span>
            <span>{cpuLoad != null ? `${cpuLoad}%` : "—"}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-default">
            <div className="h-full bg-[#00897b]" style={{ width: cpuLoad != null ? `${cpuLoad}%` : "0%" }}></div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-soft">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#fff3e0] text-[#fb8c00]">
            <Activity size={20} />
          </div>
          <div className="rounded-full bg-[#fff3e0] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#fb8c00]">
            {data?.apiStatus ?? "—"}
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            API HEALTH
          </p>
          <p className="mt-1 text-3xl font-bold text-text-primary">{avgResponseTime}</p>
        </div>
        <div className="mt-6 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Memory</span>
            <span>{memoryPctNum != null ? `${memoryPctNum}%` : "—"}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-default">
            <div className="h-full bg-[#fb8c00]" style={{ width: memoryPctNum != null ? `${memoryPctNum}%` : "0%" }}></div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border-default bg-bg-surface p-5 shadow-soft">
        <div className="flex items-start justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#e0f2f1] text-[#00897b]">
            <Database size={20} />
          </div>
          <div className="rounded-full bg-[#e0f2f1] px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-[#00897b]">
            HEALTHY
          </div>
        </div>
        <div className="mt-4">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            DB CONNECTIONS
          </p>
          <p className="mt-1 text-3xl font-bold text-text-primary">{dbConnections}</p>
        </div>
        <div className="mt-6 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>Active Pools</span>
            <span>{dbCapacityPct != null ? `${dbCapacityPct}% Capacity` : "—"}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-border-default">
            <div className="h-full bg-[#00897b]" style={{ width: dbCapacityPct != null ? `${dbCapacityPct}%` : "0%" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
