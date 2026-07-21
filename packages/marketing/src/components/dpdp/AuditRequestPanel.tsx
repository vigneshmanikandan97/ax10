import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { CONTACT_EMAIL } from '../../data/content'
import { BrutalButton } from '../ui/BrutalButton'

type AuditRequestPanelProps = {
  onClose: () => void
}

export function AuditRequestPanel({ onClose }: AuditRequestPanelProps) {
  const [submitting, setSubmitting] = useState(false)

  const nextUrl = useMemo(
    () => `${window.location.origin}/dpdp?sent=1`,
    [],
  )

  return (
    <motion.aside
      initial={{ width: 0, opacity: 0 }}
      animate={{ width: 'min(420px, 100%)', opacity: 1 }}
      exit={{ width: 0, opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-28 z-20 mb-10 h-fit shrink-0 self-start overflow-hidden md:top-32"
    >
      <div className="w-[min(420px,90vw)] space-y-5 rounded-2xl border-2 border-primary bg-surface p-6 shadow-brutal-primary-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-label-mono text-[10px] uppercase text-primary">
              DPDP Audit Request
            </h3>
            <p className="mt-2 text-sm text-text-secondary">
              Tell us about your systems. We&apos;ll scope a 6-step audit and reply within one business day.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close audit request form"
            className="shrink-0 rounded-lg border-2 border-border-subtle p-1.5 text-text-secondary transition-colors hover:border-primary hover:text-primary"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form
          action={`https://formsubmit.co/${CONTACT_EMAIL}`}
          method="POST"
          onSubmit={() => setSubmitting(true)}
          className="space-y-4"
        >
          <input type="hidden" name="_subject" value="New DPDP audit request" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
          <input type="hidden" name="_next" value={nextUrl} />

          <div>
            <label htmlFor="audit-name" className="mb-2 block font-label-mono text-[10px] uppercase text-text-secondary">
              Name *
            </label>
            <input
              id="audit-name"
              name="name"
              required
              className="w-full rounded-xl border-2 border-border-subtle bg-surface-deep px-4 py-3 text-text-primary outline-none transition-colors focus:border-primary"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="audit-email" className="mb-2 block font-label-mono text-[10px] uppercase text-text-secondary">
              Work email *
            </label>
            <input
              id="audit-email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border-2 border-border-subtle bg-surface-deep px-4 py-3 text-text-primary outline-none transition-colors focus:border-primary"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="audit-company" className="mb-2 block font-label-mono text-[10px] uppercase text-text-secondary">
              Company *
            </label>
            <input
              id="audit-company"
              name="company"
              required
              className="w-full rounded-xl border-2 border-border-subtle bg-surface-deep px-4 py-3 text-text-primary outline-none transition-colors focus:border-primary"
              placeholder="Company name"
            />
          </div>

          <div>
            <label htmlFor="audit-notes" className="mb-2 block font-label-mono text-[10px] uppercase text-text-secondary">
              Systems in scope
            </label>
            <textarea
              id="audit-notes"
              name="message"
              rows={4}
              className="w-full resize-y rounded-xl border-2 border-border-subtle bg-surface-deep px-4 py-3 text-text-primary outline-none transition-colors focus:border-primary"
              placeholder="What systems hold personal data today?"
            />
          </div>

          <BrutalButton variant="primary" type="submit" className={`w-full ${submitting ? 'opacity-70' : ''}`}>
            {submitting ? 'Sending…' : 'Request Audit'}
          </BrutalButton>
        </form>
      </div>
    </motion.aside>
  )
}
