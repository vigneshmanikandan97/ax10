import { whyUsProcess } from '../../../data/content'

export function WhyUsAside() {
  return (
    <p className="inline-flex max-w-md items-center rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-2 text-[13px] leading-snug text-text-secondary backdrop-blur-sm md:px-5 md:py-2.5 md:text-sm">
      {whyUsProcess.headline}
    </p>
  )
}
