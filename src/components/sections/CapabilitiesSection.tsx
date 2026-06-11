import { useLayoutEffect, useRef } from 'react'
import { capabilities, capabilitiesIntro } from '../../data/content'
import { gsap } from '../../lib/gsap'
import { BrutalCard, SectionLabel } from '../ui/BrutalCard'
import { CapabilitiesAside } from './capabilities/CapabilitiesAside'
import { LiquidGlassFilter } from '../effects/LiquidGlassFilter'

export function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-cap-header]', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 20,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.out',
        force3D: true,
      })

      gsap.from('[data-cap-aside]', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
        y: 32,
        opacity: 0,
        duration: 0.55,
        ease: 'power2.out',
        force3D: true,
      })

      gsap.from('[data-cap-card]', {
        scrollTrigger: {
          trigger: '[data-cap-cards]',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 36,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
        ease: 'power2.out',
        force3D: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="what-we-do"
      className="relative min-h-screen scroll-mt-16 overflow-visible py-20 md:py-28 lg:py-32"
    >
      <LiquidGlassFilter />

      <div className="content-layer relative z-10 mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div data-cap-header className="mb-10 md:mb-12">
          <SectionLabel>Capabilities</SectionLabel>
          <h2
            data-thread-entry
            className="type-display max-w-3xl text-[36px] leading-[1.02] md:text-[56px]"
          >
            {capabilitiesIntro.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)] xl:gap-20">
          <div data-cap-aside className="lg:sticky lg:top-28">
            <CapabilitiesAside />
          </div>

          <div data-cap-cards className="grid gap-4 md:gap-6">
            {capabilities.map((cap) => (
              <div key={cap.title} data-cap-card>
                <BrutalCard className="frosted-bar !border !border-white/[0.08] !bg-transparent !shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_40px_rgba(0,0,0,0.42)] hover:!shadow-brutal-primary">
                  <div className="mb-4 flex items-start justify-between md:mb-6">
                    <span className="material-symbols-outlined text-2xl text-primary md:text-3xl">
                      {cap.icon}
                    </span>
                    <span className="border border-white/[0.08] bg-white/[0.06] px-2 py-0.5 font-label-mono text-[9px] text-text-secondary">
                      {cap.tag}
                    </span>
                  </div>
                  <h3 className="mb-3 font-headline-md text-headline-md text-text-primary md:mb-4">
                    {cap.title}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-text-secondary">
                    {cap.description}
                  </p>
                </BrutalCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
