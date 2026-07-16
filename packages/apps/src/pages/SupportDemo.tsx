import { useState } from 'react'
import { PanelRightOpen } from 'lucide-react'
import { AppTopNav } from '../components/support/AppTopNav'
import { QueueSidebar } from '../components/support/QueueSidebar'
import { TicketQueuePanel } from '../components/support/TicketQueuePanel'
import { ConversationThread } from '../components/support/ConversationThread'
import { ThemisIntelPanel } from '../components/support/ThemisIntelPanel'
import { NewTicketModal, type NewTicketInput } from '../components/support/NewTicketModal'
import { tickets as initialTickets, type Channel, type TicketRecord } from '../data/tickets'

export function SupportDemo() {
  const [themisOpen, setThemisOpen] = useState(true)
  const [newTicketOpen, setNewTicketOpen] = useState(false)
  const [tickets, setTickets] = useState<TicketRecord[]>(initialTickets)
  const [activeId, setActiveId] = useState(initialTickets[0].id)

  const activeTicket = tickets.find((t) => t.id === activeId) ?? tickets[0]

  function handleSend(text: string, channel: Channel) {
    setTickets((prev) =>
      prev.map((t) =>
        t.id !== activeId
          ? t
          : {
              ...t,
              messages: [
                ...t.messages,
                {
                  id: `m${t.messages.length + 1}`,
                  from: 'agent',
                  name: 'You',
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  channel,
                  parts: [{ text }],
                },
              ],
            },
      ),
    )
  }

  function handleCreateTicket(input: NewTicketInput) {
    const id = `${Math.floor(10000 + Math.random() * 9000)}`
    const newTicket: TicketRecord = {
      id,
      systemCode: input.title.toUpperCase().replace(/[^A-Z0-9]+/g, '_').slice(0, 40),
      title: input.title,
      priority: input.priority,
      meta: `Opened by ${input.customer} • just now`,
      messages: input.description
        ? [{ id: 'm1', from: 'customer', name: input.customer, time: 'Just now', channel: 'email', parts: [{ text: input.description }] }]
        : [],
      aiSuggestion: {
        badge: 'AI Suggestion',
        body: 'New ticket — Themis has not analyzed this conversation yet.',
        actions: [
          { label: 'Apply Reply', tone: 'default' },
          { label: 'Refine', tone: 'default' },
        ],
      },
      ai: {
        confidence: 0,
        sentiment: 'PENDING',
        sentimentNote: 'Awaiting first analysis pass',
        summaryParts: [{ text: 'No summary available yet for this ticket.' }],
        actions: [{ label: 'Run Themis Analysis', tone: 'default' }],
        telemetry: Array.from({ length: 7 }, () => ({ height: 6, tone: 'ok' as const })),
      },
    }
    setTickets((prev) => [newTicket, ...prev])
    setActiveId(id)
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
        <TicketQueuePanel tickets={tickets} activeId={activeTicket.id} onSelect={setActiveId} />
        <ConversationThread
          ticket={activeTicket}
          messages={activeTicket.messages}
          onSend={handleSend}
          themisOpen={themisOpen}
          onToggleThemis={() => setThemisOpen((v) => !v)}
        />
        {themisOpen ? (
          <ThemisIntelPanel key={activeTicket.id} ticket={activeTicket} onClose={() => setThemisOpen(false)} />
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
