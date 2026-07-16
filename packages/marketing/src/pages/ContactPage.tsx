import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { CONTACT_EMAIL, SUPPORT_EMAIL } from '../data/content'
import { BrutalButton } from '../components/ui/BrutalButton'

export function ContactPage() {
  const [searchParams] = useSearchParams()
  const sent = searchParams.get('sent') === '1'
  const [submitting, setSubmitting] = useState(false)

  const nextUrl = useMemo(
    () => `${window.location.origin}/contact?sent=1`,
    [],
  )

  const handleSubmit = () => {
    setSubmitting(true)
  }

  return (
    <PageLayout
      title="Contact"
      subtitle="Tell us about your project. We usually reply within one business day."
    >
      {sent ? (
        <div className="mb-8 rounded-xl border-2 border-primary bg-primary/10 p-6 shadow-brutal-primary-sm">
          <p className="font-label-mono text-label-mono text-primary">
            Message received. We&apos;ll respond at the earliest with a proposal and a brief discovery call.
          </p>
        </div>
      ) : null}

      <div className="grid gap-10 md:grid-cols-[1fr_280px]">
        <form
          action={`https://formsubmit.co/${CONTACT_EMAIL}`}
          method="POST"
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <input type="hidden" name="_subject" value="New AX10 website enquiry" />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="_template" value="table" />
          <input type="text" name="_honey" className="hidden" tabIndex={-1} autoComplete="off" />
          <input type="hidden" name="_next" value={nextUrl} />

          <div>
            <label htmlFor="name" className="mb-2 block font-label-mono text-[10px] uppercase text-text-secondary">
              Name *
            </label>
            <input
              id="name"
              name="name"
              required
              className="w-full rounded-xl border-2 border-border-subtle bg-surface px-4 py-3 text-text-primary outline-none transition-colors focus:border-primary"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block font-label-mono text-[10px] uppercase text-text-secondary">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-xl border-2 border-border-subtle bg-surface px-4 py-3 text-text-primary outline-none transition-colors focus:border-primary"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="company" className="mb-2 block font-label-mono text-[10px] uppercase text-text-secondary">
              Company
            </label>
            <input
              id="company"
              name="company"
              className="w-full rounded-xl border-2 border-border-subtle bg-surface px-4 py-3 text-text-primary outline-none transition-colors focus:border-primary"
              placeholder="Company name"
            />
          </div>

          <div>
            <label htmlFor="message" className="mb-2 block font-label-mono text-[10px] uppercase text-text-secondary">
              Message *
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="w-full resize-y rounded-xl border-2 border-border-subtle bg-surface px-4 py-3 text-text-primary outline-none transition-colors focus:border-primary"
              placeholder="What problem are you trying to solve?"
            />
          </div>

          <p className="text-sm text-text-secondary/80">
            By submitting, you agree to our processing of your data as described in
            our Privacy Policy.
          </p>

          <BrutalButton variant="primary" type="submit" className={`w-full sm:w-auto ${submitting ? 'opacity-70' : ''}`}>
            {submitting ? 'Sending…' : 'Send Message'}
          </BrutalButton>
        </form>

        <aside className="space-y-6 rounded-2xl border-2 border-border-subtle bg-surface p-6 shadow-brutal-dark">
          <div>
            <h3 className="mb-2 font-label-mono text-[10px] uppercase text-primary">
              Project enquiries
            </h3>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-text-primary hover:text-primary"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div>
            <h3 className="mb-2 font-label-mono text-[10px] uppercase text-primary">
              Client support
            </h3>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-text-primary hover:text-primary"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
          <div>
            <h3 className="mb-2 font-label-mono text-[10px] uppercase text-primary">
              Location
            </h3>
            <p className="text-sm">Chennai, India · Remote worldwide</p>
          </div>
          <div>
            <h3 className="mb-2 font-label-mono text-[10px] uppercase text-primary">
              Response time
            </h3>
            <p className="text-sm text-text-secondary">
              We respond to most enquiries within 1 business day.
            </p>
          </div>
        </aside>
      </div>
    </PageLayout>
  )
}
