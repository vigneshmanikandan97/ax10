type RadialGlowProps = {
  className?: string
  color?: string
  size?: string
  position?: string
  animate?: boolean
}

export function RadialGlow({
  className = '',
  color = 'rgba(105, 201, 145, 0.12)',
  size = '60%',
  position = '50% 40%',
  animate = true,
}: RadialGlowProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${animate ? 'animate-glow-drift' : ''} ${className}`}
      aria-hidden="true"
      style={{
        background: `radial-gradient(ellipse ${size} at ${position}, ${color}, transparent 70%)`,
      }}
    />
  )
}

export function RadialMesh({ className = '' }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 size-full overflow-hidden bg-surface-deep ${className}`}
      aria-hidden="true"
    >
      <div
        className="absolute -left-1/4 top-0 h-[85%] w-[75%] animate-mesh-a opacity-50"
        style={{
          background:
            'radial-gradient(circle, rgba(159,255,176,0.28) 0%, transparent 68%)',
          filter: 'blur(48px)',
        }}
      />
      <div
        className="absolute -right-1/4 bottom-0 h-[75%] w-[65%] animate-mesh-b opacity-45"
        style={{
          background:
            'radial-gradient(circle, rgba(105,201,145,0.32) 0%, transparent 62%)',
          filter: 'blur(56px)',
        }}
      />
      <div
        className="absolute left-1/3 top-1/2 h-[55%] w-[45%] -translate-y-1/2 animate-mesh-c opacity-35"
        style={{
          background:
            'radial-gradient(circle, rgba(190,202,191,0.2) 0%, transparent 58%)',
          filter: 'blur(44px)',
        }}
      />
    </div>
  )
}
