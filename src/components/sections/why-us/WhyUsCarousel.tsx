import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CarouselNavigator } from '@/components/ui/carousel-navigator'
import { whyUsCards } from '@/data/content'
import { BrutalCard } from '@/components/ui/BrutalCard'

const AUTO_DELAY = 6000

const whyUsCarouselThemes = whyUsCards.map(() => ({
  bg: 'bg-[rgba(18,20,21,0.72)]',
  button: 'bg-primary hover:bg-mint-bright',
  dot: 'bg-white/20',
  progress: 'bg-primary/35',
}))

export function WhyUsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const card = whyUsCards[currentIndex]

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const id = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % whyUsCards.length)
    }, AUTO_DELAY)

    return () => window.clearInterval(id)
  }, [currentIndex])

  return (
    <div data-why-cards className="flex flex-col gap-6 md:gap-8">
      <div className="relative min-h-[300px] md:min-h-[340px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={card.index}
            data-why-card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <BrutalCard
              className="frosted-bar !border !border-white/[0.08] !bg-transparent !shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_12px_40px_rgba(0,0,0,0.42)] hover:!shadow-brutal-primary"
              accent={card.accent}
            >
              <div className="mb-4 flex items-start justify-between md:mb-6">
                <span className="font-label-mono text-2xl text-primary md:text-3xl">
                  {card.index}
                </span>
                <span className="border border-white/[0.08] bg-white/[0.06] px-2 py-0.5 font-label-mono text-[9px] text-text-secondary">
                  Core value
                </span>
              </div>
              <h3 className="mb-3 font-headline-md text-headline-md text-text-primary md:mb-4">
                {card.title}
              </h3>
              <p className="text-[15px] leading-relaxed text-text-secondary">
                {card.body}
              </p>
            </BrutalCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <CarouselNavigator
        totalSlides={whyUsCards.length}
        autoDelay={AUTO_DELAY}
        themes={whyUsCarouselThemes}
        currentIndex={currentIndex}
        slideKey={currentIndex}
        onIndexChange={setCurrentIndex}
      />
    </div>
  )
}
