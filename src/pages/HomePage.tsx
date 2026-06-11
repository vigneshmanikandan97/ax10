import { lazy, Suspense, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { Footer } from '../components/layout/Footer'
import { ScrollToTopButton } from '../components/layout/ScrollToTopButton'
import { LazyMount } from '../components/layout/LazyMount'
import { LandingAtmosphere } from '../components/effects/LandingAtmosphere'
import { HeroSection } from '../components/sections/HeroSection'
import { scrollToSection } from '../lib/scroll'

const CustomCursor = lazy(() =>
  import('../components/layout/CustomCursor').then((module) => ({
    default: module.CustomCursor,
  })),
)
const ScrollThread = lazy(() =>
  import('../components/effects/ScrollThread').then((module) => ({
    default: module.ScrollThread,
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
    <div ref={pageRef} className="relative min-h-screen overflow-x-hidden">
      <LandingAtmosphere />
      <Navbar />

      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>

      <LazyMount rootMargin="320px 0px" fallback={null}>
        <Suspense fallback={null}>
          <ScrollThread
            pageRef={pageRef}
            globeRef={globeRef}
            footerEmailRef={footerEmailRef}
          />
        </Suspense>
      </LazyMount>

      <LazyMount
        className="pointer-events-none absolute right-[-10vw] top-[5vh] z-[1] hidden overflow-visible lg:block"
        rootMargin="480px 0px"
        minHeight="min-h-[70vh]"
        fallback={null}
      >
        <Suspense fallback={null}>
          <div
            ref={globeRef}
            className="pointer-events-none overflow-visible"
            aria-hidden="true"
          >
            <HeroBlob />
          </div>
        </Suspense>
      </LazyMount>

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
