import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import type { Priority } from '../../data/tickets'

export type NewTicketInput = {
  title: string
  description: string
  priority: Priority
  customer: string
}

const priorityOptions: Priority[] = ['urgent', 'medium', 'low']

export function NewTicketModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (input: NewTicketInput) => void
}) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [customer, setCustomer] = useState('')
  const [confirmDiscard, setConfirmDiscard] = useState(false)

  const isDirty = title.trim().length > 0 || description.trim().length > 0 || customer.trim().length > 0
  const canSubmit = title.trim().length > 0 && customer.trim().length > 0

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') requestClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  function requestClose() {
    if (isDirty) {
      setConfirmDiscard(true)
    } else {
      onClose()
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return
    onCreate({ title: title.trim(), description: description.trim(), priority, customer: customer.trim() })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) requestClose()
      }}
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className={`flex h-[80vh] w-full max-w-3xl flex-col border border-[#3e4941] bg-[#181d19] shadow-[0_-8px_0_0_#69c991] transition-transform duration-300 ease-out ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#3e4941] px-6 py-5">
          <h2 className="font-label-mono text-[12px] font-medium uppercase tracking-[0.1em] text-[#dfe4dd]">
            New Ticket
          </h2>
          <button type="button" onClick={requestClose} aria-label="Close">
            <X className="h-4 w-4 text-[#becabf]" strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 space-y-5 overflow-y-auto px-6 py-6">
          <div>
            <label className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
              Customer
            </label>
            <input
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
              placeholder="Customer name"
              className="mt-2 w-full border border-[#3e4941] bg-[#0f1511] px-3 py-2.5 text-[14px] text-[#dfe4dd] placeholder:text-[#6b7280] focus:border-[#85e5ab] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Short summary of the issue"
              className="mt-2 w-full border border-[#3e4941] bg-[#0f1511] px-3 py-2.5 text-[14px] text-[#dfe4dd] placeholder:text-[#6b7280] focus:border-[#85e5ab] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe what's happening..."
              className="mt-2 w-full resize-none border border-[#3e4941] bg-[#0f1511] px-3 py-2.5 text-[14px] text-[#dfe4dd] placeholder:text-[#6b7280] focus:border-[#85e5ab] focus:outline-none"
            />
          </div>

          <div>
            <label className="font-label-mono text-[10px] uppercase tracking-[0.06em] text-[#becabf]">
              Priority
            </label>
            <div className="mt-2 flex gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPriority(option)}
                  className={`flex-1 border px-3 py-2 font-label-mono text-[11px] uppercase ${
                    priority === option
                      ? 'border-[#85e5ab] bg-[rgba(133,229,171,0.1)] text-[#85e5ab]'
                      : 'border-[#3e4941] text-[#becabf]'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </form>

        <div className="flex shrink-0 gap-3 border-t border-[#3e4941] px-6 py-5">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1 bg-[#69c991] py-3 font-label-mono text-[12px] font-bold uppercase tracking-[0.08em] text-[#005330] shadow-[4px_4px_0_0_#69c991] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:translate-x-0 disabled:hover:translate-y-0"
          >
            Create Ticket
          </button>
          <button
            type="button"
            onClick={requestClose}
            className="border border-[#3e4941] px-6 py-3 font-label-mono text-[12px] uppercase text-[#becabf]"
          >
            Cancel
          </button>
        </div>
      </div>

      {confirmDiscard && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-sm border border-[#3e4941] bg-[#181d19] p-6 shadow-[6px_6px_0_0_#ffb4ab]">
            <p className="font-label-mono text-[12px] font-medium uppercase tracking-[0.06em] text-[#dfe4dd]">
              Discard ticket draft?
            </p>
            <p className="mt-3 text-[14px] leading-[20px] text-[#becabf]">
              Unsaved changes will be lost.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-[rgba(255,180,171,0.4)] bg-[rgba(255,180,171,0.08)] py-2.5 font-label-mono text-[11px] font-bold uppercase text-[#ffb4ab]"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={() => setConfirmDiscard(false)}
                className="flex-1 border border-[#3e4941] py-2.5 font-label-mono text-[11px] uppercase text-[#becabf]"
              >
                Keep Editing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
