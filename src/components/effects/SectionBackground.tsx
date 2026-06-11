import { DitherCanvas } from './DitherCanvas'
import { DotGridCanvas } from './DotGridCanvas'
import { HeatmapCanvas } from './HeatmapCanvas'
import { RadialMesh } from './RadialGlow'
import { SectionBackdrop } from './SectionBackdrop'

export type SectionBackgroundVariant =
  | 'hero'
  | 'capabilities'
  | 'why-us'
  | 'stories'

type SectionBackgroundProps = {
  variant: SectionBackgroundVariant
}

/** Fixed animated background per homepage section (no randomisation on reload). */
export function SectionBackground({ variant }: SectionBackgroundProps) {
  return (
    <>
      <SectionBackdrop>
        {variant === 'hero' && <HeatmapCanvas />}
        {variant === 'capabilities' && <DitherCanvas />}
        {variant === 'why-us' && <RadialMesh />}
        {variant === 'stories' && <DotGridCanvas />}
      </SectionBackdrop>
      <div className="section-overlay" />
    </>
  )
}
