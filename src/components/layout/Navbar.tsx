import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { navLinks } from '../../data/content'
import { scrollToSection } from '../../lib/scroll'
import { BrutalButton } from '../ui/BrutalButton'

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    e.preventDefault()
    setOpen(false)

    if (!isHome) {
      navigate('/', { state: { scrollTo: href } })
      return
    }

    scrollToSection(href)
  }

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-3 sm:px-4 sm:pt-4 md:px-6">
        <nav
          className={`pointer-events-auto flex h-12 w-full items-center transition-all duration-300 ease-out md:h-[52px] ${
            scrolled
              ? 'frosted-bar max-w-[920px] rounded-full px-2 md:px-3'
              : 'max-w-container-max border border-transparent bg-transparent shadow-none'
          }`}
          aria-label="Primary"
        >
          <div className="relative flex h-full w-full items-center justify-between px-3 md:px-4">
            <Link
              to="/"
              className="group flex shrink-0 items-center gap-2"
              onClick={() => setOpen(false)}
            >
              <img src="/ax10-logo.png" alt="AX10" className="h-5 w-auto" />
              <span className="font-label-mono text-label-mono font-bold tracking-tighter text-white transition-colors group-hover:text-primary">
                AX10
              </span>
            </Link>

            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex lg:gap-9">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-body-lg text-[13px] text-text-secondary transition-colors hover:text-text-primary"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link to="/contact" className="hidden sm:block">
                {scrolled ? (
                  <span className="inline-flex items-center rounded-full bg-text-primary px-4 py-1.5 font-body-lg text-[12px] font-medium text-surface-deep transition-opacity hover:opacity-90">
                    Get Started
                  </span>
                ) : (
                  <BrutalButton variant="ghost" className="!px-4 !py-1.5 text-[10px]">
                    Get Started
                  </BrutalButton>
                )}
              </Link>
              <button
                type="button"
                className={`flex h-9 w-9 items-center justify-center text-text-primary transition-colors md:hidden ${
                  scrolled
                    ? 'rounded-full hover:bg-white/5'
                    : 'border border-white/10 bg-surface/20 hover:border-primary/40'
                }`}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                <span className="material-symbols-outlined text-xl">
                  {open ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-[55] transition-opacity duration-200 md:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <button
          type="button"
          className="absolute inset-0 bg-surface-deep/50 backdrop-blur-sm"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
        <div className="pointer-events-none flex justify-center px-3 pt-[4.75rem] sm:px-4">
          <div className="frosted-panel pointer-events-auto w-full max-w-sm p-6">
            <div className="flex flex-col gap-5">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="font-body-lg text-lg text-text-primary transition-colors hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
              <Link to="/contact" onClick={() => setOpen(false)}>
                <BrutalButton variant="primary" className="w-full justify-center">
                  Get Started
                </BrutalButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
