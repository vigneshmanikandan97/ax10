import { useLayoutEffect, useRef } from 'react'
import { testimonials, testimonialsHeading } from '../../data/content'
import { gsap } from '../../lib/gsap'
import { DotGridCanvas } from '../effects/DotGridCanvas'
import { BrutalCard, SectionLabel } from '../ui/BrutalCard'

export function TestimonialsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-story-item]', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 28,
        opacity: 0,
        duration: 0.45,
        stagger: 0.06,
        ease: 'power2.out',
        force3D: true,
      })

      gsap.from('[data-story-card]', {
        scrollTrigger: {
          trigger: '[data-story-grid]',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        y: 24,
        opacity: 0,
        duration: 0.4,
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
      id="stories"
      className="relative isolate scroll-mt-16 flex min-h-screen flex-col justify-center overflow-hidden py-20 md:py-32"
    >
      <div
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden="true"
      >
        <DotGridCanvas overlay />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(8,9,10,0.42)_100%)]" />
      </div>

      <div className="content-layer relative z-10 mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="mb-10 md:mb-16">
          <div data-story-item>
            <SectionLabel>Client stories</SectionLabel>
          </div>
          <h2
            data-story-item
            className="type-display max-w-3xl text-[36px] leading-[1.02] md:text-[56px]"
          >
            {testimonialsHeading}
          </h2>
        </div>

        <div
          data-story-grid
          className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8"
        >
          {testimonials.map((t) => (
            <div key={t.initials} data-story-card>
              <BrutalCard className="flex h-full flex-col">
                <div className="mb-6 flex gap-1 opacity-50 md:mb-8">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className="material-symbols-outlined text-xs text-primary"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      star
                    </span>
                  ))}
                </div>
                <p className="mb-8 flex-1 text-[16px] font-light italic leading-relaxed text-text-primary md:mb-12 md:text-[18px]">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4 border-t-2 border-border-subtle pt-4 md:pt-6">
                  <div className="flex h-10 w-10 items-center justify-center border-2 border-primary bg-primary/20 font-label-mono text-xs text-primary">
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-label-mono text-xs uppercase text-text-primary">
                      {t.name}
                    </div>
                    <div className="font-label-mono text-[9px] uppercase text-text-secondary">
                      {t.role}
                    </div>
                  </div>
                </div>
              </BrutalCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
