import { Inbox, Users, AlertTriangle, Bug, CheckCircle2, HelpCircle, FileText } from 'lucide-react'
import { queueNav, type QueueKey } from '../../data/tickets'

const iconMap = {
  inbox: Inbox,
  user: Users,
  alert: AlertTriangle,
  bug: Bug,
  check: CheckCircle2,
}

export function QueueSidebar({
  activeQueue,
  onSelectQueue,
  counts,
  onNewTicket,
}: {
  activeQueue: QueueKey
  onSelectQueue: (key: QueueKey) => void
  counts: Record<QueueKey, number>
  onNewTicket?: () => void
}) {
  return (
    <div className="flex h-full min-h-0 flex-col border-r border-[#3e4941] bg-[#1c211d] py-6">
      <div className="px-4 pb-8">
        <p className="font-label-mono text-[12px] font-medium uppercase tracking-[0.08em] text-[#85e5ab]">
          QUEUES
        </p>
        <p className="mt-1 text-[14px] text-[#becabf] opacity-70">Engineering Support</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {queueNav.map((item) => {
          const Icon = iconMap[item.icon]
          const active = item.key === activeQueue
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onSelectQueue(item.key)}
              className={`flex items-center justify-between gap-3 px-4 py-3 font-label-mono text-[12px] font-medium uppercase tracking-[0.08em] transition-colors hover:bg-[#242a25] ${
                active ? 'bg-[#242a25] text-[#85e5ab]' : 'text-[#becabf]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                {item.label}
              </span>
              <span className={`text-[10px] ${active ? 'text-[#85e5ab]' : 'text-[#6b7280]'}`}>
                {counts[item.key]}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="px-4 pb-4">
        <button
          type="button"
          onClick={() => onNewTicket?.()}
          className="w-full bg-[#69c991] py-3 font-label-mono text-[12px] font-bold uppercase tracking-[0.08em] text-[#005330] shadow-[4px_4px_0_0_#69c991] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          NEW TICKET
        </button>
      </div>

      <div className="flex flex-col gap-1 border-t border-[#3e4941] pt-4">
        <button
          type="button"
          className="flex items-center gap-3 px-4 py-2 font-label-mono text-[12px] font-medium uppercase tracking-[0.08em] text-[#becabf] transition-colors hover:text-[#85e5ab]"
        >
          <HelpCircle className="h-5 w-5" strokeWidth={1.75} />
          Help
        </button>
        <button
          type="button"
          className="flex items-center gap-3 px-4 py-2 font-label-mono text-[12px] font-medium uppercase tracking-[0.08em] text-[#becabf] transition-colors hover:text-[#85e5ab]"
        >
          <FileText className="h-5 w-5" strokeWidth={1.75} />
          Documentation
        </button>
      </div>
    </div>
  )
}
