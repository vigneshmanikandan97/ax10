import { useState } from 'react'
import { PanelRightOpen } from 'lucide-react'
import { AppTopNav } from '../components/support/AppTopNav'
import { QueueSidebar } from '../components/support/QueueSidebar'
import { TicketQueuePanel } from '../components/support/TicketQueuePanel'
import { ConversationThread } from '../components/support/ConversationThread'
import { ThemisIntelPanel } from '../components/support/ThemisIntelPanel'
import { NewTicketModal, type NewTicketInput } from '../components/support/NewTicketModal'
import { ticket, type Channel, type QueueTicket, type ThreadMessage } from '../data/tickets'

export function SupportDemo() {
  const [themisOpen, setThemisOpen] = useState(true)
  const [newTicketOpen, setNewTicketOpen] = useState(false)
  const [messages, setMessages] = useState<ThreadMessage[]>(ticket.messages)
  const [queue, setQueue] = useState<QueueTicket[]>(ticket.queue)

  function handleSend(text: string, channel: Channel) {
    setMessages((prev) => [
      ...prev,
      {
        id: `m${prev.length + 1}`,
        from: 'agent',
        name: 'You',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel,
        parts: [{ text }],
      },
    ])
  }

  function handleCreateTicket(input: NewTicketInput) {
    const id = `${Math.floor(10000 + Math.random() * 9000)}`
    setQueue((prev) => [
      {
        id,
        code: `Ticket ${id}`,
        title: input.title,
        priority: input.priority,
        meta: `OPENED BY ${input.customer.toUpperCase()} • JUST NOW`,
      },
      ...prev,
    ])
    setNewTicketOpen(false)
  }

  return (
    <main className="flex h-screen flex-col bg-[#0f1511] text-[#dfe4dd]">
      <AppTopNav />
      <div
        className={`grid min-h-0 flex-1 overflow-hidden ${
          themisOpen ? 'grid-cols-[240px_320px_1fr_360px]' : 'grid-cols-[240px_320px_1fr_44px]'
        }`}
      >
        <QueueSidebar onNewTicket={() => setNewTicketOpen(true)} />
        <TicketQueuePanel queue={queue} />
        <ConversationThread
          messages={messages}
          onSend={handleSend}
          themisOpen={themisOpen}
          onToggleThemis={() => setThemisOpen((v) => !v)}
        />
        {themisOpen ? (
          <ThemisIntelPanel onClose={() => setThemisOpen(false)} />
        ) : (
          <button
            type="button"
            onClick={() => setThemisOpen(true)}
            aria-label="Expand Themis Intel"
            className="flex h-full flex-col items-center gap-3 border-l border-[#3e4941] bg-[#1c211d] pt-5 hover:bg-[#242a25]"
          >
            <PanelRightOpen className="h-4 w-4 text-[#85e5ab]" strokeWidth={1.75} />
          </button>
        )}
      </div>

      {newTicketOpen && (
        <NewTicketModal onClose={() => setNewTicketOpen(false)} onCreate={handleCreateTicket} />
      )}
    </main>
  )
}
