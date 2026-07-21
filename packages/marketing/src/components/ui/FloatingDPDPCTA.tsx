import { ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function FloatingDPDPCTA() {
  return (
    <Link
      to="/dpdp"
      aria-label="Get a free DPDP compliance audit"
      className="group fixed bottom-6 left-6 z-[65] flex items-center gap-2 overflow-hidden rounded-full border-2 border-primary px-5 py-3 font-label-mono text-[11px] font-bold uppercase tracking-wider text-surface-deep shadow-brutal-primary transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-brutal-primary-lg md:bottom-8 md:left-8"
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border-2 border-primary/60 animate-ping"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-gradient-x bg-[length:200%_200%] bg-gradient-to-r from-primary via-mint-bright to-primary"
      />
      <ShieldCheck className="relative z-10 h-4 w-4" aria-hidden="true" />
      <span className="relative z-10">Free DPDP Audit</span>
    </Link>
  )
}
