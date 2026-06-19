import { lazy, Suspense, useLayoutEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AppLoader } from './components/layout/AppLoader'
import { RouteFallback } from './components/ui/RouteFallback'
import { ScrollThread } from './components/effects/ScrollThread'
import { AppReadyContext } from './context/AppReadyContext'

const HomePage = lazy(() =>
  import('./pages/HomePage').then((module) => ({ default: module.HomePage })),
)
const PrivacyPage = lazy(() =>
  import('./pages/PrivacyPage').then((module) => ({ default: module.PrivacyPage })),
)
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then((module) => ({ default: module.TermsPage })),
)
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((module) => ({ default: module.ContactPage })),
)

function App() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [loading, setLoading] = useState(
    () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
    if (!isHome) return

    let disposed = false
    const refresh = () =>
      void import('./lib/gsap').then(({ ScrollTrigger }) => {
        if (disposed) return
        ScrollTrigger.refresh()
      })

    refresh()

    let resizeTimer: number | undefined
    const onResize = () => {
      window.clearTimeout(resizeTimer)
      resizeTimer = window.setTimeout(refresh, 150)
    }

    window.addEventListener('resize', onResize)

    return () => {
      disposed = true
      window.clearTimeout(resizeTimer)
      window.removeEventListener('resize', onResize)
    }
  }, [location.pathname, isHome])

  const appReady = !loading

  return (
    <AppReadyContext.Provider value={appReady}>
      {loading ? <AppLoader onComplete={() => setLoading(false)} /> : null}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </Suspense>
      {isHome && appReady ? <ScrollThread key={location.key} /> : null}
    </AppReadyContext.Provider>
  )
}

export default App
