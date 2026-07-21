type AuditCTAButtonProps = {
  onClick: () => void
}

export function AuditCTAButton({ onClick }: AuditCTAButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative inline-flex items-center gap-3 overflow-hidden rounded-xl border-2 border-primary px-8 py-4 font-label-mono text-label-mono font-bold uppercase tracking-wider text-surface-deep shadow-brutal-primary transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-brutal-primary-lg active:translate-x-0.5 active:translate-y-0.5"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-gradient-x bg-[length:200%_200%] bg-gradient-to-r from-primary via-mint-bright to-primary"
      />
      <span className="relative z-10">Get the AX10 Audit</span>
    </button>
  )
}
