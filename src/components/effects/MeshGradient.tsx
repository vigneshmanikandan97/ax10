type MeshIntensity = 'subtle' | 'medium' | 'bold'

const LAYER_PRESETS: Record<
  MeshIntensity,
  Array<{ color: string; x: string; y: string; size: string }>
> = {
  subtle: [
    { color: 'rgba(105, 201, 145, 0.12)', x: '20%', y: '30%', size: '50%' },
    { color: 'rgba(159, 255, 176, 0.08)', x: '75%', y: '65%', size: '45%' },
    { color: 'rgba(36, 40, 43, 0.35)', x: '50%', y: '50%', size: '70%' },
  ],
  medium: [
    { color: 'rgba(159, 255, 176, 0.16)', x: '12%', y: '18%', size: '55%' },
    { color: 'rgba(105, 201, 145, 0.14)', x: '88%', y: '22%', size: '50%' },
    { color: 'rgba(105, 201, 145, 0.1)', x: '45%', y: '85%', size: '60%' },
    { color: 'rgba(36, 40, 43, 0.3)', x: '65%', y: '55%', size: '48%' },
  ],
  bold: [
    { color: 'rgba(159, 255, 176, 0.22)', x: '10%', y: '15%', size: '58%' },
    { color: 'rgba(105, 201, 145, 0.2)', x: '90%', y: '20%', size: '52%' },
    { color: 'rgba(105, 201, 145, 0.14)', x: '50%', y: '88%', size: '68%' },
    { color: 'rgba(190, 202, 191, 0.08)', x: '35%', y: '45%', size: '40%' },
    { color: 'rgba(36, 40, 43, 0.35)', x: '72%', y: '58%', size: '46%' },
  ],
}

type MeshGradientProps = {
  className?: string
  intensity?: MeshIntensity
}

export function MeshGradient({
  className = '',
  intensity = 'medium',
}: MeshGradientProps) {
  const layers = LAYER_PRESETS[intensity]
  const background = layers
    .map(
      (layer) =>
        `radial-gradient(ellipse ${layer.size} at ${layer.x} ${layer.y}, ${layer.color}, transparent 72%)`,
    )
    .join(', ')

  return (
    <div
      className={`pointer-events-none absolute inset-0 size-full overflow-hidden bg-surface-deep ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute -inset-[25%] size-[150%] animate-mesh-drift transform-gpu will-change-transform"
        style={{
          background,
          filter: 'blur(52px)',
        }}
      />
    </div>
  )
}
