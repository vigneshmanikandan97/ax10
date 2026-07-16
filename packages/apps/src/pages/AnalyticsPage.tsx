import { Timer, ShieldCheck, CheckCircle2, BarChart3 } from 'lucide-react'
import { AppTopNav } from '../components/support/AppTopNav'
import { QueueSidebar } from '../components/support/QueueSidebar'
import {
  analyticsKpis,
  resolutionTrend,
  peakLoadIndex,
  sentimentDistribution,
  sentimentNote,
  activeIncidents,
  categoryBreakdown,
  clusterTags,
  clusterStatus,
} from '../data/analytics'

const kpiIcons = { down: Timer, up: ShieldCheck, flat: CheckCircle2 }

const priorityTagStyles: Record<string, string> = {
  urgent: 'border-[rgba(255,180,171,0.4)] bg-[rgba(255,180,171,0.1)] text-[#ffb4ab]',
  normal: 'border-[rgba(133,229,171,0.3)] bg-[rgba(133,229,171,0.08)] text-[#85e5ab]',
  low: 'border-[#3e4941] bg-[rgba(190,202,191,0.05)] text-[#becabf]',
}

const statusDotStyles: Record<string, string> = {
  ESCALATED: 'bg-[#ffb4ab]',
  ACTIVE: 'bg-[#dfe4dd]',
  QUEUED: 'bg-[#becabf]',
  RESOLVED: 'bg-[#85e5ab]',
}

const sentimentBarStyles: Record<string, string> = {
  ok: 'bg-[#85e5ab]',
  neutral: 'bg-[#becabf]',
  warn: 'bg-[#ffb4ab]',
}

const chartWidth = 700
const chartHeight = 200

function toPoints(values: number[]) {
  const step = chartWidth / (values.length - 1)
  return values.map((v, i) => `${i * step},${chartHeight - v * 2.6}`).join(' ')
}

export function AnalyticsPage() {
  const incomingPoints = toPoints(resolutionTrend.map((p) => p.incoming))
  const resolvedPoints = toPoints(resolutionTrend.map((p) => p.resolved))
  const peakStep = chartWidth / (resolutionTrend.length - 1)
  const peakX = peakLoadIndex * peakStep
  const peakY = chartHeight - resolutionTrend[peakLoadIndex].incoming * 2.6

  return (
    <main className="flex h-screen flex-col bg-[#0f1511] text-[#dfe4dd]">
      <AppTopNav />
      <div className="grid flex-1 grid-cols-[240px_1fr] overflow-hidden">
        <QueueSidebar />
        <div className="overflow-y-auto p-8">
          <div className="grid grid-cols-3 gap-4">
            {analyticsKpis.map((kpi) => {
              const Icon = kpiIcons[kpi.tone]
              return (
                <div
                  key={kpi.label}
                  className="border border-[#3e4941] bg-[#181d19] p-[25px] shadow-[4px_4px_0_0_#69c991]"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
                      {kpi.label}
                    </p>
                    <Icon className="h-4 w-4 text-[#becabf]" strokeWidth={1.75} />
                  </div>
                  <p className="type-display mt-4 flex items-end gap-1 font-display text-[36px] leading-[36px] text-[#85e5ab]">
                    {kpi.value}
                    {kpi.unit && <span className="text-[18px] text-[#becabf]">{kpi.unit}</span>}
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <span
                      className={`border px-2 py-0.5 font-label-mono text-[10px] font-medium ${
                        kpi.tone === 'down'
                          ? 'border-[rgba(133,229,171,0.3)] bg-[rgba(133,229,171,0.08)] text-[#85e5ab]'
                          : kpi.tone === 'up'
                            ? 'border-[rgba(133,229,171,0.3)] bg-[rgba(133,229,171,0.08)] text-[#85e5ab]'
                            : 'border-[#3e4941] bg-[rgba(190,202,191,0.05)] text-[#becabf]'
                      }`}
                    >
                      {kpi.delta}
                    </span>
                    <span className="font-label-mono text-[11px] text-[#becabf]">{kpi.note}</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-6 grid grid-cols-[1fr_340px] gap-6">
            <section className="border border-[#3e4941] bg-[#181d19] p-[25px]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[18px] font-semibold text-[#dfe4dd]">Ticket Volume vs. Resolution</h2>
                  <p className="mt-1 font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
                    TEMPORAL ANALYSIS (LAST 7 DAYS)
                  </p>
                </div>
                <div className="flex items-center gap-4 font-label-mono text-[11px] text-[#becabf]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 bg-[#85e5ab]" /> Incoming
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-px w-3 bg-[#becabf]" /> Resolved
                  </span>
                </div>
              </div>

              <div className="relative mt-6">
                <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="h-48 w-full overflow-visible">
                  {[0, 1, 2, 3].map((i) => (
                    <line
                      key={i}
                      x1={0}
                      x2={chartWidth}
                      y1={(chartHeight / 4) * i}
                      y2={(chartHeight / 4) * i}
                      stroke="#3e4941"
                      strokeDasharray="4 4"
                      strokeWidth={1}
                    />
                  ))}
                  <polyline points={resolvedPoints} fill="none" stroke="#becabf" strokeWidth={2} strokeDasharray="6 5" />
                  <polyline points={incomingPoints} fill="none" stroke="#85e5ab" strokeWidth={2.5} />
                  <circle cx={peakX} cy={peakY} r={4} fill="#85e5ab" />
                  <text x={peakX} y={peakY - 12} fill="#becabf" fontSize={10} textAnchor="middle" className="font-label-mono">
                    PEAK LOAD
                  </text>
                </svg>
              </div>
              <div className="mt-2 flex justify-between">
                {resolutionTrend.map((p) => (
                  <span key={p.day} className="flex-1 text-center font-label-mono text-[10px] text-[#becabf]">
                    {p.day}
                  </span>
                ))}
              </div>
            </section>

            <section className="border border-[#3e4941] bg-[#181d19] p-[25px]">
              <h2 className="text-[18px] font-semibold text-[#dfe4dd]">Sentiment Distribution</h2>
              <div className="mt-6 space-y-5">
                {sentimentDistribution.map((row) => (
                  <div key={row.label}>
                    <div className="flex items-center justify-between font-label-mono text-[12px] text-[#dfe4dd]">
                      <span>{row.label}</span>
                      <span className="text-[#becabf]">{row.pct}%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full border border-[#3e4941] bg-[#313632]">
                      <div className={`h-full ${sentimentBarStyles[row.tone]}`} style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex items-start gap-2 border-t border-[#3e4941] pt-4">
                <BarChart3 className="mt-0.5 h-4 w-4 shrink-0 text-[#becabf]" strokeWidth={1.75} />
                <p className="text-[13px] leading-[19px] text-[#becabf]">{sentimentNote}</p>
              </div>
            </section>
          </div>

          <section className="mt-6 border border-[#3e4941] bg-[#181d19] p-[25px] shadow-[4px_4px_0_0_#69c991]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-[18px] font-semibold text-[#dfe4dd]">Active Incident SLA Monitor</h2>
                <span className="border border-[rgba(133,229,171,0.3)] bg-[rgba(133,229,171,0.1)] px-2 py-0.5 font-label-mono text-[10px] font-medium uppercase text-[#85e5ab]">
                  LIVE
                </span>
              </div>
              <span className="font-label-mono text-[11px] text-[#becabf]">REF: NODE_77-X9</span>
            </div>

            <table className="mt-5 w-full">
              <thead>
                <tr className="border-b border-[#3e4941] text-left font-label-mono text-[11px] uppercase text-[#becabf]">
                  <th className="py-2 font-medium">ID</th>
                  <th className="py-2 font-medium">Priority</th>
                  <th className="py-2 font-medium">Category</th>
                  <th className="py-2 font-medium">Time-to-Breach</th>
                  <th className="py-2 font-medium">Status</th>
                  <th className="py-2 font-medium">Engineer</th>
                </tr>
              </thead>
              <tbody>
                {activeIncidents.map((row) => (
                  <tr key={row.id} className="border-b border-[#3e4941] last:border-b-0">
                    <td className="py-4 font-label-mono text-[13px] text-[#dfe4dd]">{row.id}</td>
                    <td className="py-4">
                      <span
                        className={`border px-2.5 py-0.5 font-label-mono text-[10px] uppercase ${priorityTagStyles[row.priority]}`}
                      >
                        {row.priority}
                      </span>
                    </td>
                    <td className="py-4 text-[14px] text-[#becabf]">{row.category}</td>
                    <td
                      className={`py-4 font-label-mono text-[13px] ${
                        row.status === 'ESCALATED' ? 'text-[#ffb4ab]' : 'text-[#dfe4dd]'
                      }`}
                    >
                      {row.timeToBreach}
                    </td>
                    <td className="py-4">
                      <span className="flex items-center gap-2 font-label-mono text-[12px] uppercase text-[#dfe4dd]">
                        {row.status === 'RESOLVED' ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#85e5ab]" strokeWidth={2} />
                        ) : (
                          <span className={`h-1.5 w-1.5 rounded-full ${statusDotStyles[row.status]}`} />
                        )}
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 text-[14px] text-[#becabf]">{row.engineer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <div className="mb-8 mt-6 grid grid-cols-2 gap-6">
            <section className="border border-[#3e4941] bg-[#181d19] p-[25px]">
              <h2 className="text-[18px] font-semibold text-[#dfe4dd]">Category Breakdown</h2>
              <div className="mt-8 flex h-32 items-end justify-around gap-6 border-b border-[#3e4941] pb-2">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.label} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full bg-[#85e5ab]" style={{ height: `${cat.pct * 2.4}px` }} />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-around">
                {categoryBreakdown.map((cat) => (
                  <span key={cat.label} className="flex-1 text-center font-label-mono text-[10px] text-[#becabf]">
                    {cat.label}
                  </span>
                ))}
              </div>
            </section>

            <section className="border border-[#3e4941] bg-[#181d19] p-[25px]">
              <h2 className="text-[18px] font-semibold text-[#dfe4dd]">Cluster Status</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {clusterTags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`flex items-center gap-1.5 border px-2.5 py-1 font-label-mono text-[10px] uppercase ${
                      tag.tone === 'warn'
                        ? 'border-[rgba(255,180,171,0.3)] bg-[rgba(255,180,171,0.08)] text-[#ffb4ab]'
                        : 'border-[rgba(133,229,171,0.3)] bg-[rgba(133,229,171,0.08)] text-[#85e5ab]'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 ${tag.tone === 'warn' ? 'bg-[#ffb4ab]' : 'bg-[#85e5ab]'}`} />
                    {tag.label}
                  </span>
                ))}
              </div>
              <div className="mt-5 space-y-3 border-t border-[#3e4941] pt-4">
                {clusterStatus.map((row) => (
                  <div key={row.label} className="flex items-center justify-between font-label-mono text-[12px]">
                    <span className="text-[#becabf]">{row.label}</span>
                    <span className="text-[#dfe4dd]">{row.value}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
