import type { Priority, TicketRecord } from '../../data/tickets'

const priorityStyles: Record<Priority, string> = {
  urgent: 'border-[rgba(255,180,171,0.2)] bg-[rgba(255,180,171,0.1)] text-[#ffb4ab]',
  medium: 'border-[rgba(133,229,171,0.2)] bg-[rgba(133,229,171,0.1)] text-[#85e5ab]',
  low: 'border-[rgba(190,202,191,0.2)] bg-[rgba(190,202,191,0.1)] text-[#becabf]',
  resolved: 'border-[rgba(124,218,143,0.2)] bg-[rgba(124,218,143,0.1)] text-[#7cda8f]',
}

function QueueRow({ item, active, onClick }: { item: TicketRecord; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col gap-1 border-t border-[#3e4941] px-5 py-5 text-left first:border-t-0 hover:bg-[#181d19] ${
        active ? 'border-l-4 border-t-0 border-l-[#85e5ab] bg-[#181d19] pl-[16px]' : ''
      } ${item.priority === 'resolved' ? 'opacity-60' : ''}`}
    >
      <div className="flex items-start justify-between">
        <span className={`font-label-mono text-[13px] ${active ? 'text-[#85e5ab]' : 'text-[#becabf]'}`}>
          Ticket {item.id}
        </span>
        <span
          className={`border px-2.5 py-0.5 font-label-mono text-[10px] uppercase ${priorityStyles[item.priority]}`}
        >
          {item.priority}
        </span>
      </div>
      <h3
        className={`pt-1 text-[16px] leading-[24px] ${
          active ? 'font-semibold text-[#dfe4dd]' : 'text-[#becabf]'
        }`}
      >
        {item.title}
      </h3>
      <p className="pt-1 font-label-mono text-[10px] uppercase text-[rgba(190,202,191,0.6)]">
        {item.meta}
      </p>
    </button>
  )
}

export function TicketQueuePanel({
  tickets,
  activeId,
  onSelect,
}: {
  tickets: TicketRecord[]
  activeId: string
  onSelect: (id: string) => void
}) {
  const activeCount = tickets.filter((t) => t.priority !== 'resolved').length
  return (
    <div className="flex h-full min-h-0 flex-col border-r border-[#3e4941] bg-[#0f1511]">
      <div className="flex h-16 items-center justify-between border-b border-[#3e4941] px-4">
        <h2 className="font-label-mono text-[12px] font-medium uppercase tracking-[0.1em] text-[#dfe4dd]">
          Live Queue
        </h2>
        <span className="bg-[rgba(133,229,171,0.2)] px-2 py-0.5 font-label-mono text-[10px] text-[#85e5ab]">
          {activeCount} Active
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {tickets.length === 0 ? (
          <p className="px-5 py-6 font-label-mono text-[12px] uppercase tracking-[0.06em] text-[#6b7280]">
            No tickets in this queue.
          </p>
        ) : (
          tickets.map((item) => (
            <QueueRow key={item.id} item={item} active={item.id === activeId} onClick={() => onSelect(item.id)} />
          ))
        )}
      </div>
    </div>
  )
}
