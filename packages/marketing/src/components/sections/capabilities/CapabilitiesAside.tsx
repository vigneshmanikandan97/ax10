import { useLayoutEffect, useState } from 'react'
import { capabilityPillars, capabilitiesIntro } from '../../../data/content'

export function CapabilitiesAside() {
  const [activeIndex, setActiveIndex] = useState(0)

  useLayoutEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % capabilityPillars.length)
    }, 5200)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <aside className="flex h-full flex-col gap-6 lg:gap-8">
      <div className="liquid-glass relative p-8 md:p-10">
        <div className="absolute left-0 top-0 h-1 w-1/4 bg-primary" aria-hidden="true" />

        <p className="type-body relative z-[1] max-w-md text-[15px] leading-relaxed md:text-base">
          {capabilitiesIntro.body}
        </p>
      </div>

      <div
        className="liquid-glass p-2 md:p-3"
        role="tablist"
        aria-label="Capability pillars"
      >
        {capabilityPillars.map((pillar, index) => {
          const isActive = index === activeIndex

          return (
            <button
              key={pillar.index}
              type="button"
              role="tab"
              aria-selected={isActive}
              onMouseEnter={() => setActiveIndex(index)}
              onFocus={() => setActiveIndex(index)}
              onClick={() => setActiveIndex(index)}
              className={`relative z-[1] w-full rounded-xl border-2 px-4 py-4 text-left transition-colors md:px-5 md:py-5 ${
                isActive
                  ? 'border-primary bg-surface/45 shadow-brutal-primary-sm backdrop-blur-md'
                  : 'border-transparent hover:border-white/10 hover:bg-surface/25'
              }`}
            >
              <div className="flex items-center gap-4">
                <span
                  className={`font-label-mono text-sm tabular-nums transition-colors ${
                    isActive ? 'text-primary' : 'text-primary/35 group-hover:text-primary/70'
                  }`}
                >
                  {pillar.index}
                </span>
                <span
                  className={`h-px transition-all ${
                    isActive
                      ? 'w-10 bg-primary/60'
                      : 'w-6 bg-border-subtle group-hover:w-8 group-hover:bg-primary/30'
                  }`}
                />
                <span
                  className={`font-label-mono text-[11px] uppercase tracking-[0.12em] md:text-label-mono ${
                    isActive ? 'text-text-primary' : 'text-text-muted group-hover:text-text-secondary'
                  }`}
                >
                  {pillar.label}
                </span>
              </div>

              <p
                className={`mt-3 overflow-hidden pl-10 text-sm leading-relaxed transition-all duration-300 md:pl-11 ${
                  isActive
                    ? 'max-h-24 opacity-100 text-text-secondary'
                    : 'max-h-0 opacity-0 text-text-muted'
                }`}
              >
                {pillar.summary}
              </p>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
