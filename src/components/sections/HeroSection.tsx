import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { heroCopy } from '../../data/content'
import { BrutalButton } from '../ui/BrutalButton'

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero-item]', {
        y: 32,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.1,
        force3D: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <header
      ref={sectionRef}
      data-hero-section
      className="relative flex min-h-[100svh] items-center overflow-visible pt-24"
    >
      <div className="content-layer relative z-10 mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="relative max-w-3xl">
          <div
            data-hero-item
            className="mb-6 inline-flex items-center gap-3 border-2 border-primary/40 bg-surface/85 px-3 py-1.5 shadow-brutal-primary-sm md:mb-8"
          >
            <span className="h-2 w-2 animate-pulse bg-primary" />
            <span className="font-label-mono text-label-caps text-primary uppercase">
              {heroCopy.badge}
            </span>
          </div>

          <h1
            data-hero-item
            className="type-display mb-6 text-[44px] leading-[1.02] md:mb-8 md:text-[76px]"
          >
            {heroCopy.headlineLead}
            <br />
            <span className="italic text-primary" data-hero-expertise>
              {heroCopy.headlineAccent}
            </span>
          </h1>

          <p
            data-hero-item
            className="type-body mb-8 max-w-xl md:mb-12"
          >
            {heroCopy.subhead}
          </p>

          <div data-hero-item className="flex flex-col gap-3 sm:flex-row sm:gap-4">
            <BrutalButton variant="primary" to="/contact" className="w-full sm:w-auto">
              Let&apos;s Talk
              <span className="material-symbols-outlined text-sm">north_east</span>
            </BrutalButton>
            <BrutalButton variant="ghost" to="/contact" className="w-full sm:w-auto">
              Start a project
              <span className="material-symbols-outlined text-sm">
                auto_awesome_motion
              </span>
            </BrutalButton>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce opacity-40">
        <span className="material-symbols-outlined text-text-secondary">south</span>
      </div>
    </header>
  )
}
