import { lazy, Suspense, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ScrollToTopButton } from '../components/layout/ScrollToTopButton'
import { LazyMount } from '../components/layout/LazyMount'
import { LandingAtmosphere } from '../components/effects/LandingAtmosphere'
import { HeroSection } from '../components/sections/HeroSection'
import { useAppReady } from '../context/AppReadyContext'
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

      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>

      <div
        ref={globeRef}
        data-hero-globe
        className="pointer-events-none absolute z-[1] block overflow-visible right-[-22vw] top-[4vh] h-[min(68vh,440px)] w-[min(68vh,440px)] sm:right-[-18vw] sm:top-[5vh] sm:h-[min(78vh,560px)] sm:w-[min(78vh,560px)] md:right-[-14vw] md:h-[min(90vh,760px)] md:w-[min(90vh,760px)] lg:right-[-10vw] lg:top-[5vh] lg:h-[min(108vh,1020px)] lg:w-[min(108vh,1020px)]"
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
