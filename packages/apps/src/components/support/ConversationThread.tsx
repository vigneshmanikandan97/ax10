import { useState } from 'react'
import { Sparkles, Send, Mail, MessageSquare, StickyNote } from 'lucide-react'
import type { Channel, ThreadMessage } from '../../data/tickets'
import { ticket } from '../../data/tickets'

const channelOptions: Array<{ value: Channel; label: string; icon: typeof Mail }> = [
  { value: 'email', label: 'Email', icon: Mail },
  { value: 'chat', label: 'Web Chat', icon: MessageSquare },
  { value: 'note', label: 'Internal Note', icon: StickyNote },
]

const channelBadge: Record<Channel, string> = {
  email: 'EMAIL',
  chat: 'WEB CHAT',
  note: 'NOTE',
}

export function ConversationThread({
  messages,
  onSend,
  themisOpen,
  onToggleThemis,
}: {
  messages: ThreadMessage[]
  onSend: (text: string, channel: Channel) => void
  themisOpen: boolean
  onToggleThemis: () => void
}) {
  const [draft, setDraft] = useState('')
  const [channel, setChannel] = useState<Channel>('email')

  function handleSend() {
    if (!draft.trim()) return
    onSend(draft.trim(), channel)
    setDraft('')
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col bg-[#0d1210]">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#3e4941] bg-[#0f1511] px-6">
        <div className="flex items-center gap-4">
          <h1 className="type-display font-display text-[24px] leading-[32px] text-[#dfe4dd]">
            #{ticket.id}
          </h1>
          <span className="h-4 w-px bg-[#3e4941]" />
          <span className="font-label-mono text-[12px] font-medium uppercase tracking-[0.08em] text-[#becabf]">
            {ticket.code}
          </span>
        </div>
        <button
          type="button"
          onClick={onToggleThemis}
          className={`flex items-center gap-2 font-label-mono text-[12px] font-medium uppercase tracking-[0.08em] ${
            themisOpen ? 'text-[#85e5ab]' : 'text-[#becabf]'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
          Themis Intel
        </button>
      </header>

      <div className="min-h-0 flex-1 space-y-8 overflow-y-auto px-6 py-6 pb-40">
        {messages.map((message) => {
          const isCustomer = message.from === 'customer'
          return (
            <div
              key={message.id}
              className={`flex max-w-[42rem] flex-col ${isCustomer ? 'items-start' : 'ml-auto items-end'}`}
            >
              <div className="mb-3 flex items-center gap-3">
                {isCustomer && (
                  <span className="flex h-8 w-8 items-center justify-center border border-[#3e4941] bg-[#1c211d] font-label-mono text-[10px] text-[#becabf]">
                    {message.name[0]}
                  </span>
                )}
                <span className="font-label-mono text-[11px]">
                  <span className={`font-bold ${isCustomer ? 'text-[#dfe4dd]' : 'text-[#85e5ab]'}`}>
                    {message.name}{' '}
                  </span>
                  <span className="text-[#becabf]">{message.time}</span>
                </span>
                {message.channel && (
                  <span className="border border-[#3e4941] px-1.5 py-0.5 font-label-mono text-[9px] uppercase text-[#becabf]">
                    {channelBadge[message.channel]}
                  </span>
                )}
                {!isCustomer && (
                  <span className="flex h-8 w-8 items-center justify-center border border-[#85e5ab] bg-[#1c211d] font-label-mono text-[10px] text-[#85e5ab]">
                    {message.name[0]}
                  </span>
                )}
              </div>
              <div
                className={`border p-[21px] text-[16px] leading-[26px] text-[#dfe4dd] ${
                  isCustomer
                    ? 'border-[#3e4941] bg-[#181d19] shadow-[4px_4px_0_0_#69c991]'
                    : 'border-[#85e5ab] bg-[rgba(133,229,171,0.05)] shadow-[4px_4px_0_0_#69c991]'
                }`}
              >
                {message.parts.map((part, i) =>
                  part.code ? (
                    <span key={i} className="bg-[#1c211d] font-label-mono text-[#69c991]">
                      {part.text}
                    </span>
                  ) : part.danger ? (
                    <span key={i} className="font-label-mono text-[#ffb4ab]">
                      {part.text}
                    </span>
                  ) : (
                    <span key={i}>{part.text}</span>
                  ),
                )}
              </div>
            </div>
          )
        })}

        <div className="relative max-w-[48rem] border border-dashed border-[#85e5ab] bg-[rgba(15,21,17,0.8)] p-[25px]">
          <span className="absolute left-6 top-[-12px] border border-[#85e5ab] bg-[#0f1511] px-2 py-px font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#85e5ab]">
            {ticket.aiSuggestion.badge}
          </span>
          <div className="flex gap-4">
            <Sparkles className="mt-1 h-6 w-6 shrink-0 text-[#85e5ab]" strokeWidth={1.5} />
            <div className="flex flex-col gap-4">
              <p className="text-[16px] leading-[24px] text-[#dfe4dd] opacity-90">
                &ldquo;{ticket.aiSuggestion.body}&rdquo;
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDraft(ticket.aiSuggestion.body)}
                  className="bg-[#85e5ab] px-6 py-2 font-label-mono text-[11px] font-bold uppercase tracking-[0.06em] text-[#00391f] shadow-[4px_4px_0_0_#69c991]"
                >
                  {ticket.aiSuggestion.actions[0].label}
                </button>
                <button
                  type="button"
                  className="border border-[#3e4941] px-6 py-2 font-label-mono text-[11px] uppercase tracking-[0.06em] text-[#becabf]"
                >
                  {ticket.aiSuggestion.actions[1].label}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="absolute inset-x-0 bottom-0 border-t border-[#3e4941] bg-[#0f1511] px-6 py-5">
        <div className="mb-3 flex items-center gap-2">
          {channelOptions.map((option) => {
            const Icon = option.icon
            const active = channel === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setChannel(option.value)}
                className={`flex items-center gap-1.5 border px-2.5 py-1 font-label-mono text-[10px] uppercase ${
                  active
                    ? 'border-[#85e5ab] bg-[rgba(133,229,171,0.1)] text-[#85e5ab]'
                    : 'border-[#3e4941] text-[#becabf]'
                }`}
              >
                <Icon className="h-3 w-3" strokeWidth={2} />
                {option.label}
              </button>
            )
          })}
        </div>
        <div className="relative border border-[#3e4941] bg-[#181d19]">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder={`Reply via ${channelOptions.find((o) => o.value === channel)?.label}...`}
            rows={2}
            className="w-full resize-none bg-transparent p-[17px] pb-[24px] font-label-mono text-[16px] text-[#dfe4dd] placeholder:text-[#6b7280] focus:outline-none"
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-4">
            <span className="font-label-mono text-[10px] text-[#becabf]">CMD + ENTER TO SEND</span>
            <button
              type="button"
              onClick={handleSend}
              disabled={!draft.trim()}
              className="flex h-10 w-10 items-center justify-center border border-[#005330] bg-[#69c991] shadow-[4px_4px_0_0_#69c991] disabled:opacity-40 disabled:shadow-none"
            >
              <Send className="h-4 w-4 text-[#0f1511]" strokeWidth={2} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
