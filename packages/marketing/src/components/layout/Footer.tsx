import { forwardRef } from 'react'
import { Link } from 'react-router-dom'
import { GENERAL_EMAIL, footerLinks } from '../../data/content'

export const Footer = forwardRef<HTMLAnchorElement>(function Footer(_props, emailRef) {
  return (
    <footer className="relative z-20 border-t-2 border-border-subtle bg-surface-deep/88 pt-16 pb-10 backdrop-blur-md md:pt-20">
      <div className="content-layer mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-10 flex flex-col items-start justify-between gap-10 border-b-2 border-border-subtle pb-12 md:mb-12 md:flex-row md:items-center md:gap-12 md:pb-16">
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-3">
              <img
                src="/ax10-logo.png"
                alt="AX10"
                className="h-4 w-auto opacity-60 grayscale"
              />
              <span className="font-label-caps text-[9px] text-label-caps text-text-secondary md:text-label-caps">
                AX10
              </span>
            </div>
            <p className="font-label-mono text-xs text-text-secondary/60">
              Built in Chennai. Working with teams worldwide.
            </p>
            <a
              ref={emailRef}
              id="footer-contact-email"
              href={`mailto:${GENERAL_EMAIL}`}
              className="block font-label-mono text-xs text-primary hover:underline"
            >
              {GENERAL_EMAIL}
            </a>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4 md:gap-x-10">
            {footerLinks.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="font-label-mono text-[10px] uppercase tracking-widest text-text-secondary transition-colors hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-start justify-between gap-4 font-label-mono text-[9px] uppercase tracking-widest text-text-secondary/40 md:flex-row md:items-center">
          <div>© 2026 AX10. All rights reserved.</div>
          <div>AI-native engineering · Human judgment · Built to ship</div>
        </div>
      </div>
    </footer>
  )
})
