import { useEffect, useState } from 'react'
import { scrollToTop } from '../../lib/scroll'

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setVisible(window.scrollY > 480)
        ticking = false
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-[70] flex h-12 w-12 items-center justify-center border-2 border-primary bg-surface text-primary shadow-brutal-primary transition-all duration-300 hover:bg-primary hover:text-surface-deep md:bottom-8 md:right-8 ${
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <span className="material-symbols-outlined">arrow_upward</span>
    </button>
  )
}
