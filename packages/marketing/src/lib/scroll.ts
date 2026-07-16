import { gsap, ScrollTrigger } from './gsap'

export const NAV_HEIGHT = 64

export function scrollToSection(selector: string) {
  const target = document.querySelector<HTMLElement>(selector)
  if (!target) return

  const y = target.offsetTop - NAV_HEIGHT
  const triggers = ScrollTrigger.getAll()

  triggers.forEach((trigger) => trigger.disable(false))

  gsap.to(window, {
    scrollTo: { y, autoKill: true },
    duration: 0.55,
    ease: 'power2.out',
    overwrite: true,
    onComplete: () => {
      triggers.forEach((trigger) => trigger.enable(false))
      ScrollTrigger.refresh()
    },
  })
}

export function scrollToTop() {
  const triggers = ScrollTrigger.getAll()
  triggers.forEach((trigger) => trigger.disable(false))

  gsap.to(window, {
    scrollTo: { y: 0, autoKill: true },
    duration: 0.5,
    ease: 'power2.out',
    onComplete: () => {
      triggers.forEach((trigger) => trigger.enable(false))
      ScrollTrigger.refresh()
    },
  })
}
