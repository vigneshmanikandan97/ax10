import { useLayoutEffect, useRef } from 'react'
import { Headset, ShoppingCart, BarChart3, ArrowUpRight } from 'lucide-react'
import { playgroundIntro, playgroundDemos, APPS_URL } from '../../data/content'
import { gsap } from '../../lib/gsap'
import { BrutalCard, SectionLabel } from '../ui/BrutalCard'
import { BrutalButton } from '../ui/BrutalButton'

const demoIcons = [Headset, ShoppingCart, BarChart3]

export function PlaygroundSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-playground-header]', {
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

      gsap.from('[data-playground-card]', {
        scrollTrigger: {
          trigger: '[data-playground-cards]',
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
      id="playground"
      className="relative scroll-mt-16 overflow-visible py-20 md:py-28 lg:py-32"
    >
      <div className="content-layer relative z-10 mx-auto w-full max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div data-playground-header className="mb-10 max-w-2xl md:mb-12">
          <SectionLabel>Playground</SectionLabel>
          <h2 className="type-display text-[36px] leading-[1.02] md:text-[52px]">
            {playgroundIntro.title}
          </h2>
          <p className="mt-4 text-body-lg text-text-secondary">{playgroundIntro.body}</p>
        </div>

        <div data-playground-cards className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {playgroundDemos.map((demo, i) => {
            const Icon = demoIcons[i]
            return (
              <div key={demo.name} data-playground-card>
                <BrutalCard className={!demo.live ? 'opacity-50' : ''}>
                  <div className="mb-4 flex items-center justify-between">
                    <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                    {demo.live ? (
                      <ArrowUpRight className="h-4 w-4 text-text-muted transition-colors group-hover:text-primary" />
                    ) : (
                      <span className="font-label-mono text-[10px] uppercase tracking-wider text-text-muted">
                        Soon
                      </span>
                    )}
                  </div>
                  <h3 className="mb-2 font-headline-md text-headline-md text-text-primary">
                    {demo.name}
                  </h3>
                  <p className="text-[15px] leading-relaxed text-text-secondary">
                    {demo.description}
                  </p>
                </BrutalCard>
              </div>
            )
          })}
        </div>

        <div className="mt-10 md:mt-12">
          <BrutalButton variant="primary" href={APPS_URL}>
            Explore Live Demos
          </BrutalButton>
        </div>
      </div>
    </section>
  )
}
