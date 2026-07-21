import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AnimatePresence } from 'motion/react'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ScrollToTopButton } from '../components/layout/ScrollToTopButton'
import { StickyAuditCTA } from '../components/dpdp/StickyAuditCTA'
import { AuditRequestPanel } from '../components/dpdp/AuditRequestPanel'
import { dpdpProcess } from '../data/content'

export function DPDPPage() {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-deep">
      <div className="dot-grid-secondary" />
      <div className="dot-grid-overlay" />
      <Navbar />

      <div className="relative z-10">
        <div className="mx-auto flex max-w-container-max items-start gap-10 px-margin-mobile pt-28 md:px-margin-desktop md:pt-32">
          <main className="min-w-0 flex-1">
            <div
              className={`transition-[max-width] duration-300 ease-out ${open ? 'max-w-none' : 'mx-auto max-w-3xl'}`}
            >
              <Link
                to="/"
                className="mb-8 inline-flex items-center gap-2 font-label-mono text-[10px] uppercase text-text-secondary transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Back to home
              </Link>
              <h1 className="mb-3 font-display-lg text-[32px] leading-tight text-text-primary md:text-display-lg">
                {dpdpProcess.title}
              </h1>
              <p className="mb-10 font-label-mono text-label-mono text-text-secondary">
                {dpdpProcess.subtitle}
              </p>

              <div className="prose-legal max-w-3xl space-y-6 text-body-lg text-text-secondary">
                <section>
                  <p>{dpdpProcess.intro}</p>
                </section>

                <section>
                  <ol className="space-y-6">
                    {dpdpProcess.steps.map((step, i) => (
                      <li key={step.title}>
                        <h2>
                          {i + 1}. {step.title}
                        </h2>
                        <p>{step.description}</p>
                      </li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>
          </main>

          <AnimatePresence>
            {open ? <AuditRequestPanel onClose={() => setOpen(false)} /> : null}
          </AnimatePresence>
        </div>

        {open ? null : <StickyAuditCTA onOpen={() => setOpen(true)} />}
      </div>

      <Footer />
      <ScrollToTopButton />
    </div>
  )
}
