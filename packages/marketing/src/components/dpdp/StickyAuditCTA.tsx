import { AuditCTAButton } from '../ui/AuditCTAButton'

type StickyAuditCTAProps = {
  onOpen: () => void
}

export function StickyAuditCTA({ onOpen }: StickyAuditCTAProps) {
  return (
    <div className="pointer-events-none sticky bottom-0 z-40 flex justify-center pb-6 pt-16">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -inset-y-2 bg-gradient-to-t from-surface-deep via-surface-deep/85 to-transparent backdrop-blur-md"
      />
      <div className="pointer-events-auto relative">
        <AuditCTAButton onClick={onOpen} />
      </div>
    </div>
  )
}
