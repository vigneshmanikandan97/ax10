import { lazy, Suspense, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ScrollToTopButton } from '../components/layout/ScrollToTopButton'
import { LazyMount } from '../components/layout/LazyMount'
import { LandingAtmosphere } from '../components/effects/LandingAtmosphere'
import { HeroSection } from '../components/sections/HeroSection'
import { useAppReady } from '../context/AppReadyContext'
import { useCoarsePointer } from '../hooks/useCoarsePointer'
import { scrollToSection } from '../lib/scroll'

const CustomCursor = lazy(() =>
  import('../components/layout/CustomCursor').then((module) => ({
    default: module.CustomCursor,
  })),
)
const HeroBlob = lazy(() =>
  import('../components/effects/HeroBlob').then((module) => ({
    default: module.HeroBlob,
  })),
)
const CapabilitiesSection = lazy(() =>
  import('../components/sections/CapabilitiesSection').then((module) => ({
    default: module.CapabilitiesSection,
  })),
)
const WhyUsSection = lazy(() =>
  import('../components/sections/WhyUsSection').then((module) => ({
    default: module.WhyUsSection,
  })),
)
const TestimonialsSection = lazy(() =>
  import('../components/sections/TestimonialsSection').then((module) => ({
    default: module.TestimonialsSection,
  })),
)

export function HomePage() {
  const location = useLocation()
  const appReady = useAppReady()
  const coarse = useCoarsePointer()
  const pageRef = useRef<HTMLDivElement>(null)
  const globeRef = useRef<HTMLDivElement>(null)
  const footerEmailRef = useRef<HTMLAnchorElement>(null)

  useLayoutEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo
    if (target) {
      const timer = window.setTimeout(() => scrollToSection(target), 150)
      return () => window.clearTimeout(timer)
    }
  }, [location.state])

  return (
    <div
      ref={pageRef}
      data-page-root
      className="relative min-h-screen overflow-x-clip"
    >
      <LandingAtmosphere />
      <Navbar />

      {!coarse ? (
        <Suspense fallback={null}>
          <CustomCursor />
        </Suspense>
      ) : null}

      <div
        ref={globeRef}
        data-hero-globe
        className="pointer-events-none absolute z-[1] block overflow-visible right-[-48vw] top-[4vh] h-[min(86vh,660px)] w-[min(86vh,660px)] sm:right-[-34vw] sm:top-[4vh] sm:h-[min(90vh,760px)] sm:w-[min(90vh,760px)] md:right-[-24vw] md:h-[min(100vh,900px)] md:w-[min(100vh,900px)] lg:right-[-16vw] lg:top-[4vh] lg:h-[min(112vh,1120px)] lg:w-[min(112vh,1120px)]"
        aria-hidden="true"
      >
        {appReady ? (
          <Suspense fallback={null}>
            <HeroBlob />
          </Suspense>
        ) : null}
      </div>

      <main className="relative z-[2]">
        <HeroSection />
        <LazyMount minHeight="min-h-screen">
          <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
            <CapabilitiesSection />
          </Suspense>
        </LazyMount>
        <LazyMount minHeight="min-h-screen">
          <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
            <WhyUsSection />
          </Suspense>
        </LazyMount>
        <LazyMount minHeight="min-h-screen">
          <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
            <TestimonialsSection />
          </Suspense>
        </LazyMount>
      </main>

      <Footer ref={footerEmailRef} />
      <ScrollToTopButton />
    </div>
  )
}
