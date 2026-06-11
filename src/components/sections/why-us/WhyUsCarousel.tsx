import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { whyUsCards } from '@/data/content'

const AUTO_DELAY = 6000
const CARD_COUNT = whyUsCards.length
const VISIBLE_RANGE = [-1, 0, 1] as const

function getCenterCardWidth(viewportWidth: number) {
  if (viewportWidth < 480) return Math.min(viewportWidth - 48, 360)
  if (viewportWidth < 768) return Math.min(viewportWidth - 64, 420)
  if (viewportWidth < 1024) return Math.min(viewportWidth * 0.58, 520)
  return Math.min(viewportWidth * 0.46, 640)
}

function getRelativeIndex(cardIndex: number, currentIndex: number) {
  let diff = cardIndex - currentIndex
  const half = Math.floor(CARD_COUNT / 2)

  if (diff > half) diff -= CARD_COUNT
  if (diff < -half) diff += CARD_COUNT

  return diff
}

function getDirection(from: number, to: number) {
  const forward = (to - from + CARD_COUNT) % CARD_COUNT
  if (forward === 1) return 1
  if (forward === CARD_COUNT - 1) return -1
  return to > from ? 1 : -1
}

function getSideOffset(viewportWidth: number, centerCardWidth: number) {
  const ideal = centerCardWidth * 0.36
  const maxSide =
    viewportWidth < 480 ? 76 : viewportWidth < 768 ? 108 : viewportWidth < 1024 ? 138 : 168
  const available = (viewportWidth - centerCardWidth) / 2 - 12

  return Math.max(64, Math.min(maxSide, ideal, available))
}

function getDeckMotion(relative: number, viewportWidth: number, centerCardWidth: number) {
  const sideX = getSideOffset(viewportWidth, centerCardWidth)
  const hiddenX = sideX + 80

  if (relative === 0) {
    return {
      x: 0,
      scale: 1,
      rotateY: 0,
      z: 0,
      opacity: 1,
      filter: 'blur(0px) brightness(1)',
      zIndex: 30,
    }
  }

  if (relative === -1) {
    return {
      x: -sideX,
      scale: 0.9,
      rotateY: 14,
      z: -70,
      opacity: 0.5,
      filter: 'blur(6px) brightness(0.82)',
      zIndex: 10,
    }
  }

  if (relative === 1) {
    return {
      x: sideX,
      scale: 0.9,
      rotateY: -14,
      z: -70,
      opacity: 0.5,
      filter: 'blur(6px) brightness(0.82)',
      zIndex: 10,
    }
  }

  const offscreen = relative < 0 ? -hiddenX : hiddenX

  return {
    x: offscreen,
    scale: 0.84,
    rotateY: relative < 0 ? 20 : -20,
    z: -110,
    opacity: 0,
    filter: 'blur(10px) brightness(0.7)',
    zIndex: 0,
  }
}

type DeckCardProps = {
  card: (typeof whyUsCards)[number]
  active: boolean
}

function DeckCard({ card, active }: DeckCardProps) {
  return (
    <article
      className={`flex h-full min-h-full flex-col rounded-[28px] border bg-[rgba(16,18,19,0.78)] p-8 backdrop-blur-2xl md:rounded-[34px] md:p-10 lg:p-12 ${
        active
          ? 'border-white/[0.1] shadow-[0_28px_72px_rgba(0,0,0,0.52),inset_0_1px_0_rgba(255,255,255,0.08)]'
          : 'border-white/[0.07] shadow-[0_16px_40px_rgba(0,0,0,0.35)]'
      }`}
    >
      <span
        className={`mb-5 block font-label-mono text-[32px] leading-none md:mb-6 md:text-[38px] ${
          active ? 'text-primary' : 'text-primary/50'
        }`}
      >
        {card.index}
      </span>

      <h3
        className={`mb-4 font-headline-md text-[24px] leading-tight md:mb-5 md:text-[30px] lg:text-[34px] ${
          active ? 'text-text-primary' : 'text-text-primary/60'
        }`}
      >
        {card.title}
      </h3>

      <p
        className={`flex-1 text-[15px] leading-relaxed md:text-[16px] lg:text-[17px] lg:leading-[1.65] ${
          active ? 'text-text-secondary' : 'text-text-secondary/50'
        }`}
      >
        {card.body}
      </p>
    </article>
  )
}

type DeckNavigatorProps = {
  currentIndex: number
  autoDelay: number
  slideKey: string
  onPrev: () => void
  onNext: () => void
  onSelect: (index: number) => void
}

function DeckNavigator({
  currentIndex,
  autoDelay,
  slideKey,
  onPrev,
  onNext,
  onSelect,
}: DeckNavigatorProps) {
  return (
    <div className="frosted-bar pointer-events-auto inline-flex items-center gap-3 rounded-full border border-white/[0.08] px-4 py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] md:gap-4 md:px-5 md:py-3">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous value"
        className="flex h-8 w-8 items-center justify-center text-text-secondary/55 transition-colors hover:text-text-secondary"
      >
        <ChevronLeft size={22} strokeWidth={1.75} />
      </button>

      <div className="flex items-center gap-2 px-1">
        {whyUsCards.map((_, index) => {
          const isActive = index === currentIndex

          return (
            <button
              key={whyUsCards[index].index}
              type="button"
              aria-label={`Go to value ${index + 1}`}
              aria-current={isActive ? 'true' : undefined}
              onClick={() => onSelect(index)}
              className={`relative h-2 overflow-hidden rounded-full transition-all duration-300 focus:outline-none ${
                isActive ? 'w-10 bg-primary/30' : 'w-2 bg-white/15 hover:bg-white/25'
              }`}
            >
              {isActive ? (
                <motion.span
                  key={slideKey}
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: autoDelay / 1000, ease: 'linear' }}
                  className="absolute inset-y-0 left-0 rounded-full bg-mint-bright shadow-[0_0_10px_rgba(105,201,145,0.5)]"
                />
              ) : null}
            </button>
          )
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        aria-label="Next value"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-surface-deep shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 active:scale-95 md:h-10 md:w-10"
      >
        <ChevronRight size={18} strokeWidth={2.5} />
      </button>
    </div>
  )
}

export function WhyUsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [autoPlayKey, setAutoPlayKey] = useState(0)
  const [viewportWidth, setViewportWidth] = useState(
    () => (typeof window !== 'undefined' ? window.innerWidth : 1280),
  )
  const directionRef = useRef(1)

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth)
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const goTo = useCallback((nextIndex: number) => {
    setCurrentIndex((current) => {
      directionRef.current = getDirection(current, nextIndex)
      return nextIndex
    })
    setAutoPlayKey((key) => key + 1)
  }, [])

  const goPrev = useCallback(() => {
    goTo((currentIndex - 1 + CARD_COUNT) % CARD_COUNT)
  }, [currentIndex, goTo])

  const goNext = useCallback(() => {
    goTo((currentIndex + 1) % CARD_COUNT)
  }, [currentIndex, goTo])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const id = window.setInterval(() => {
      setCurrentIndex((current) => {
        directionRef.current = 1
        return (current + 1) % CARD_COUNT
      })
    }, AUTO_DELAY)

    return () => window.clearInterval(id)
  }, [autoPlayKey])

  const centerCardWidth = getCenterCardWidth(viewportWidth)

  return (
    <div
      data-why-cards
      className="relative mx-auto flex w-full max-w-full flex-col items-center overflow-visible px-4 sm:px-6"
    >
      <div className="relative w-full overflow-visible">
        <div
          className="pointer-events-none invisible mx-auto grid w-full select-none grid-cols-1 grid-rows-1"
          style={{ maxWidth: centerCardWidth }}
          aria-hidden="true"
        >
          {whyUsCards.map((card) => (
            <div key={`spacer-${card.index}`} className="col-start-1 row-start-1">
              <DeckCard card={card} active />
            </div>
          ))}
        </div>

        <div className="absolute inset-0 flex items-center justify-center overflow-visible [perspective:1400px]">
          <div
            className="relative h-full"
            style={{ width: centerCardWidth, transformStyle: 'preserve-3d' }}
          >
            {whyUsCards.map((card, cardIndex) => {
              const relative = getRelativeIndex(cardIndex, currentIndex)
              const deck = getDeckMotion(relative, viewportWidth, centerCardWidth)
              const isVisible = VISIBLE_RANGE.includes(
                relative as (typeof VISIBLE_RANGE)[number],
              )

              return (
                <div
                  key={card.index}
                  className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2"
                  style={{ zIndex: deck.zIndex }}
                >
                  <motion.div
                    data-why-card={relative === 0 ? true : undefined}
                    className="h-full w-full will-change-transform transform-gpu"
                    style={{
                      transformStyle: 'preserve-3d',
                      transformOrigin: 'center center',
                    }}
                    initial={false}
                    animate={{
                      x: deck.x,
                      scale: deck.scale,
                      rotateY: deck.rotateY,
                      z: deck.z,
                      opacity: deck.opacity,
                      filter: deck.filter,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: directionRef.current > 0 ? 260 : 280,
                      damping: 28,
                      mass: 0.9,
                    }}
                    aria-hidden={!isVisible}
                  >
                    <DeckCard card={card} active={relative === 0} />
                  </motion.div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="relative z-40 mt-6 flex justify-center md:mt-8">
        <DeckNavigator
          currentIndex={currentIndex}
          autoDelay={AUTO_DELAY}
          slideKey={`${currentIndex}-${autoPlayKey}`}
          onPrev={goPrev}
          onNext={goNext}
          onSelect={goTo}
        />
      </div>
    </div>
  )
}
