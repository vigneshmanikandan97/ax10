import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

type BrutalButtonProps = {
  children: ReactNode
  variant?: 'primary' | 'ghost'
  className?: string
  href?: string
  to?: string
  type?: 'button' | 'submit'
  onClick?: () => void
}

export function BrutalButton({
  children,
  variant = 'primary',
  className = '',
  href,
  to,
  type = 'button',
  onClick,
}: BrutalButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-3 border-2 px-8 py-3 font-label-mono text-label-mono font-bold uppercase tracking-wider transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5'

  const styles =
    variant === 'primary'
      ? 'border-primary bg-primary text-surface-deep shadow-brutal-primary hover:shadow-brutal-primary-lg hover:bg-mint-bright'
      : 'border-border-subtle bg-surface text-text-primary shadow-brutal-dark hover:border-primary hover:shadow-brutal-primary'

  const classes = `${base} ${styles} ${className}`

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick}>
      {children}
    </button>
  )
}
