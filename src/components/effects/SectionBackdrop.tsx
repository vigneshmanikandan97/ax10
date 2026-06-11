import type { ReactNode } from 'react'

export function SectionBackdrop({ children }: { children: ReactNode }) {
  return (
    <div
      data-section-backdrop
      className="pointer-events-none absolute inset-0 z-0 h-full w-full min-h-full min-w-full overflow-hidden bg-surface-deep"
      aria-hidden="true"
    >
      {children}
    </div>
  )
}
