import { Link, useLocation } from 'react-router-dom'
import { Bell, Settings } from 'lucide-react'

const links = [
  { label: 'Dashboard', to: '/support/dashboard' },
  { label: 'Triage', to: '/support/triage' },
  { label: 'Analytics', to: '/support/analytics' },
]

export function AppTopNav() {
  const { pathname } = useLocation()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#3e4941] bg-[#0f1511] px-6">
      <div className="flex items-center gap-8">
        <Link to="/" className="font-display text-[32px] leading-none tracking-[-0.02em] text-[#85e5ab]">
          AX10
        </Link>
        <nav className="flex items-center gap-6">
          {links.map((link) => {
            const active = pathname === link.to
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`pb-1.5 text-[16px] ${
                  active
                    ? 'border-b-2 border-[#85e5ab] font-bold text-[#85e5ab]'
                    : 'font-medium text-[#becabf] hover:text-[#dfe4dd]'
                }`}
              >
                {link.label}
              </Link>
            )
          })}
          <span className="pb-1.5 text-[16px] font-medium text-[#becabf] opacity-40">Team</span>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Bell className="h-4 w-4 text-[#becabf]" strokeWidth={1.75} />
        <Settings className="h-5 w-5 text-[#becabf]" strokeWidth={1.75} />
        <span className="flex h-8 w-8 items-center justify-center border border-[#3e4941] bg-[#1c211d] font-label-mono text-[10px] text-[#becabf]">
          AM
        </span>
      </div>
    </header>
  )
}
