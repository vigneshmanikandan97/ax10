import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { ScrollToTopButton } from './ScrollToTopButton'

type PageLayoutProps = {
  children: ReactNode
  title: string
  subtitle?: string
}

export function PageLayout({ children, title, subtitle }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-surface-deep">
      <div className="dot-grid-secondary" />
      <div className="dot-grid-overlay" />
      <Navbar />
      <main className="relative z-10 mx-auto max-w-3xl px-margin-mobile pb-20 pt-28 md:px-margin-desktop md:pt-32">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 font-label-mono text-[10px] uppercase text-text-secondary transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to home
        </Link>
        <h1 className="mb-3 font-display-lg text-[32px] leading-tight text-text-primary md:text-display-lg">
          {title}
        </h1>
        {subtitle ? (
          <p className="mb-10 font-label-mono text-label-mono text-text-secondary">
            {subtitle}
          </p>
        ) : null}
        <div className="prose-legal space-y-6 text-body-lg text-text-secondary">
          {children}
        </div>
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  )
}
