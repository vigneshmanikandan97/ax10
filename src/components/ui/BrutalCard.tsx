import type { ReactNode } from 'react'

type BrutalCardProps = {
  children: ReactNode
  className?: string
  accent?: string
}

export function BrutalCard({
  children,
  className = '',
  accent = '#69C991',
}: BrutalCardProps) {
  return (
    <div
      data-cursor-card
      className={`group relative rounded-2xl border-2 border-border-subtle bg-surface p-8 shadow-brutal-dark transition-transform duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:border-primary hover:shadow-brutal-primary ${className}`}
      style={{ ['--card-accent' as string]: accent }}
    >
      {children}
    </div>
  )
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-6 inline-block rounded-lg border-2 border-primary/40 bg-primary/8 px-3 py-1.5 font-label-mono text-label-caps text-primary shadow-brutal-primary-sm">
      {children}
    </span>
  )
}
