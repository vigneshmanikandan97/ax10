import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { SectionLabel } from '../ui/BrutalCard'
import { WhyUsAside } from './why-us/WhyUsAside'
import { WhyUsCarousel } from './why-us/WhyUsCarousel'
import { OurProcess } from './why-us/OurProcess'

export function WhyUsSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-why-header]', {
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

      gsap.from('[data-why-aside]', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 82%',
          toggleActions: 'play none none reverse',
        },
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        force3D: true,
      })

      gsap.from('[data-why-card]', {
        scrollTrigger: {
          trigger: '[data-why-cards]',
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

      gsap.from('[data-our-process]', {
        scrollTrigger: {
          trigger: '[data-our-process]',
          start: 'top 88%',
          toggleActions: 'play none none reverse',
        },
        y: 28,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        force3D: true,
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="relative scroll-mt-16 overflow-visible py-20 md:py-28 lg:py-32"
    >
      <div className="content-layer relative z-10 mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div
          data-why-header
          className="relative z-20 mb-8 max-w-xs md:max-w-sm lg:absolute lg:left-0 lg:top-0 lg:mb-0"
        >
          <SectionLabel>Core values</SectionLabel>
          <h2 className="type-display text-[36px] leading-[1.02] md:text-[52px] lg:text-[56px]">
            Why us
          </h2>
          <div data-why-aside className="mt-4 md:mt-5">
            <WhyUsAside />
          </div>
        </div>

        <div className="relative z-10 -mx-margin-mobile flex min-h-[min(52vh,540px)] w-[calc(100%+2*theme(spacing.margin-mobile))] items-center justify-center overflow-visible md:min-h-[min(56vh,580px)] md:-mx-margin-desktop md:w-[calc(100%+2*theme(spacing.margin-desktop))] lg:min-h-[min(60vh,620px)]">
          <WhyUsCarousel />
        </div>

        <div className="mt-8 md:mt-10">
          <OurProcess />
        </div>
      </div>
    </section>
  )
}
