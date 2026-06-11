import { useLayoutEffect, useRef } from 'react'
import { gsap } from '../../lib/gsap'
import { SectionLabel } from '../ui/BrutalCard'
import { WhyUsAside } from './why-us/WhyUsAside'
import { WhyUsCarousel } from './why-us/WhyUsCarousel'

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
        y: 32,
        opacity: 0,
        duration: 0.55,
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
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="why-us"
      className="relative min-h-screen scroll-mt-16 overflow-visible py-20 md:py-28 lg:py-32"
    >
      <div className="content-layer relative z-10 mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div data-why-header className="mb-10 md:mb-12">
          <SectionLabel>Core values</SectionLabel>
          <h2 className="type-display max-w-3xl text-[36px] leading-[1.02] md:text-[56px]">
            Why us
          </h2>
        </div>

        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)] lg:gap-14 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)] xl:gap-20">
          <div data-why-aside className="lg:sticky lg:top-28">
            <WhyUsAside />
          </div>

          <WhyUsCarousel />
        </div>
      </div>
    </section>
  )
}
