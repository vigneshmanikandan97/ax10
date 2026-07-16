import { BarChart3, X, ArrowRight, RotateCcw } from 'lucide-react'
import type { TicketRecord } from '../../data/tickets'

export function ThemisIntelPanel({ ticket, onClose }: { ticket: TicketRecord; onClose: () => void }) {
  const { ai } = ticket

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-[#3e4941] bg-[#1c211d]">
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-[#3e4941] px-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-[18px] w-[18px] text-[#dfe4dd]" strokeWidth={1.75} />
          <h2 className="font-label-mono text-[12px] font-medium uppercase tracking-[0.1em] text-[#dfe4dd]">
            Themis Intelligence
          </h2>
        </div>
        <button type="button" onClick={onClose} aria-label="Collapse Themis Intel">
          <X className="h-3.5 w-3.5 text-[#becabf]" strokeWidth={2} />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-6">
        <section className="border border-[#3e4941] bg-[#181d19] p-[25px] shadow-[4px_4px_0_0_#69c991]">
          <p className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
            CONFIDENCE INDEX
          </p>
          <div className="mt-4 flex items-center justify-between">
            <p className="type-display font-display text-[36px] leading-[36px] text-[#85e5ab]">
              {ai.confidence}%
            </p>
            <svg
              width={44}
              height={44}
              viewBox="0 0 44 44"
              className="shrink-0"
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle cx={22} cy={22} r={17} fill="none" stroke="#313632" strokeWidth={5} />
              <circle
                cx={22}
                cy={22}
                r={17}
                fill="none"
                stroke="#85e5ab"
                strokeWidth={5}
                strokeLinecap="square"
                strokeDasharray={2 * Math.PI * 17}
                strokeDashoffset={2 * Math.PI * 17 * (1 - ai.confidence / 100)}
              />
            </svg>
          </div>
        </section>

        <section>
          <p className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
            SENTIMENT DETECTION
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="border border-[rgba(255,180,171,0.2)] bg-[rgba(255,180,171,0.1)] px-3 py-1 font-label-mono text-[12px] font-medium uppercase tracking-[0.06em] text-[#ffb4ab]">
              {ai.sentiment}
            </span>
            <p className="text-[16px] leading-[24px] text-[#becabf]">{ai.sentimentNote}</p>
          </div>
        </section>

        <section className="border border-[#3e4941] bg-[#181d19] p-[25px]">
          <div className="flex items-center gap-2">
            <p className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
              AUTOMATED SUMMARY
            </p>
            <span className="h-1.5 w-1.5 rounded-full bg-[#85e5ab]" />
          </div>
          <p className="mt-4 text-[16px] leading-[26px] text-[#dfe4dd]">
            {ai.summaryParts.map((part, i) =>
              part.highlight ? (
                <span key={i} className="text-[#85e5ab]">
                  {part.text}
                </span>
              ) : part.danger ? (
                <span key={i} className="text-[#ffb4ab]">
                  {part.text}
                </span>
              ) : part.underline ? (
                <span key={i} className="underline decoration-[rgba(133,229,171,0.4)]">
                  {part.text}
                </span>
              ) : (
                <span key={i}>{part.text}</span>
              ),
            )}
          </p>
        </section>

        <section className="space-y-3">
          <p className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
            RECOMMENDED ACTIONS
          </p>
          {ai.actions.map((action) => {
            const danger = action.tone === 'danger'
            return (
              <button
                key={action.label}
                type="button"
                className={`flex w-full items-center justify-between border p-[17px] font-label-mono text-[12px] font-medium uppercase tracking-[0.06em] ${
                  danger
                    ? 'border-[rgba(255,180,171,0.4)] bg-[rgba(255,180,171,0.05)] text-[#ffb4ab]'
                    : 'border-[#3e4941] bg-[rgba(15,21,17,0.4)] text-[#dfe4dd]'
                }`}
              >
                {action.label}
                {danger ? (
                  <RotateCcw className="h-4 w-4" strokeWidth={2} />
                ) : (
                  <ArrowRight className="h-4 w-4" strokeWidth={2} />
                )}
              </button>
            )
          })}
        </section>

        <section className="border border-[#3e4941] bg-[#181d19] p-[17px]">
          <p className="pb-2 font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
            CLUSTER LATENCY (MS)
          </p>
          <div className="flex h-16 items-end justify-center gap-1.5 border-b border-[#3e4941] pb-1">
            {ai.telemetry.map((bar, i) => (
              <div
                key={i}
                className={`w-full ${bar.tone === 'warn' ? 'bg-[#ffb4ab]' : 'bg-[rgba(133,229,171,0.2)]'}`}
                style={{ height: `${bar.height}px` }}
              />
            ))}
          </div>
          <div className="flex justify-between pt-1 opacity-60">
            <span className="font-label-mono text-[9px] text-[#becabf]">T-60M</span>
            <span className="font-label-mono text-[9px] text-[#becabf]">NOW</span>
          </div>
        </section>
      </div>
    </aside>
  )
}
