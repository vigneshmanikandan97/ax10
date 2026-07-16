import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
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
    let ticking = false

    const update = () => {
      setScrolled(window.scrollY > 16)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }

    update()
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
          className={`pointer-events-auto flex w-full items-center transition-all duration-300 ease-out ${
            scrolled
              ? 'frosted-bar h-14 max-w-[960px] rounded-full px-2 md:h-16 md:px-3'
              : 'h-16 max-w-container-max border border-transparent bg-transparent shadow-none md:h-[72px]'
          }`}
          aria-label="Primary"
        >
          <div className="relative flex h-full w-full items-center justify-between px-3 md:px-5">
            <Link
              to="/"
              className="group flex shrink-0 items-center"
              onClick={() => setOpen(false)}
              aria-label="AX10 home"
            >
              <img
                src="/ax10-logo.png"
                alt="AX10"
                className="w-auto transition-all duration-300 ease-out group-hover:opacity-80 group-active:scale-95 h-9 md:h-10"
              />
            </Link>

            <div className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 md:flex lg:gap-10">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="group/nav relative font-body-lg text-[13px] tracking-wide text-text-secondary transition-colors hover:text-text-primary"
                >
                  {link.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 ease-out group-hover/nav:scale-x-100" />
                </a>
              ))}
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Link to="/contact" className="hidden sm:block">
                {scrolled ? (
                  <span className="inline-flex items-center rounded-full bg-text-primary px-5 py-2 font-body-lg text-[12px] font-medium text-surface-deep transition-opacity hover:opacity-90">
                    Get Started
                  </span>
                ) : (
                  <BrutalButton variant="ghost" className="!px-5 !py-2 text-[10px]">
                    Get Started
                  </BrutalButton>
                )}
              </Link>
              <button
                type="button"
                className={`flex h-10 w-10 items-center justify-center text-text-primary transition-colors md:hidden ${
                  scrolled
                    ? 'rounded-full hover:bg-white/5'
                    : 'rounded-lg border border-white/10 bg-surface/20 hover:border-primary/40'
                }`}
                aria-label={open ? 'Close menu' : 'Open menu'}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? (
                  <X className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="h-6 w-6" aria-hidden="true" />
                )}
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
        <div className="pointer-events-none flex justify-center px-3 pt-[6rem] sm:px-4">
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
