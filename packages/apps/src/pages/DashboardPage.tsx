import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { AppTopNav } from '../components/support/AppTopNav'
import { kpis, volumeChart, priorityBreakdown, recentActivity } from '../data/dashboard'

const priorityStyles: Record<string, string> = {
  urgent: 'text-[#ffb4ab]',
  medium: 'text-[#85e5ab]',
  low: 'text-[#becabf]',
  resolved: 'text-[#7cda8f]',
}

export function DashboardPage() {
  return (
    <main className="flex h-screen flex-col bg-[#0f1511] text-[#dfe4dd]">
      <AppTopNav />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="grid grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div
              key={kpi.label}
              className="border border-[#3e4941] bg-[#181d19] p-[25px] shadow-[4px_4px_0_0_#69c991]"
            >
              <p className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
                {kpi.label}
              </p>
              <div className="mt-4 flex items-end justify-between">
                <p className="type-display font-display text-[36px] leading-[36px] text-[#85e5ab]">
                  {kpi.value}
                </p>
                <span
                  className={`flex items-center gap-1 font-label-mono text-[12px] font-medium ${
                    kpi.tone === 'up' ? 'text-[#85e5ab]' : 'text-[#ffb4ab]'
                  }`}
                >
                  {kpi.tone === 'up' ? (
                    <TrendingUp className="h-3.5 w-3.5" strokeWidth={2} />
                  ) : (
                    <TrendingDown className="h-3.5 w-3.5" strokeWidth={2} />
                  )}
                  {kpi.delta}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-[1fr_360px] gap-6">
          <section className="border border-[#3e4941] bg-[#181d19] p-[25px]">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#dfe4dd]" strokeWidth={1.75} />
              <p className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
                TICKET VOLUME (7 DAYS)
              </p>
            </div>
            <div className="mt-8 flex h-40 items-end justify-between gap-3 border-b border-[#3e4941] pb-2">
              {volumeChart.map((bar) => (
                <div key={bar.day} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className={`w-full ${bar.tone === 'warn' ? 'bg-[#ffb4ab]' : 'bg-[#85e5ab]'}`}
                    style={{ height: `${bar.height * 2}px` }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-1 flex justify-between opacity-60">
              {volumeChart.map((bar) => (
                <span key={bar.day} className="flex-1 text-center font-label-mono text-[9px] text-[#becabf]">
                  {bar.day}
                </span>
              ))}
            </div>
          </section>

          <section className="border border-[#3e4941] bg-[#181d19] p-[25px]">
            <p className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
              PRIORITY BREAKDOWN
            </p>
            <div className="mt-5 space-y-4">
              {priorityBreakdown.map((row) => (
                <div key={row.priority} className="flex items-center justify-between">
                  <span
                    className={`font-label-mono text-[12px] uppercase ${priorityStyles[row.priority]}`}
                  >
                    {row.priority}
                  </span>
                  <span className="type-display font-display text-[20px] text-[#dfe4dd]">
                    {row.count}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 border border-[#3e4941] bg-[#181d19] p-[25px]">
          <p className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
            RECENT ACTIVITY
          </p>
          <div className="mt-4 divide-y divide-[#3e4941]">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[14px] text-[#dfe4dd]">{item.label}</p>
                  <p className="font-label-mono text-[11px] text-[#becabf]">{item.ticketCode}</p>
                </div>
                <span className="font-label-mono text-[10px] uppercase text-[rgba(190,202,191,0.6)]">
                  {item.time}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
