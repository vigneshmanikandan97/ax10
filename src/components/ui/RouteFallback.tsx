/** Lightweight route suspense fallback — avoids a second full-screen loader. */
export function RouteFallback() {
  return (
    <div
      className="flex min-h-[40vh] items-center justify-center"
      aria-busy="true"
      aria-label="Loading page"
    >
      <div className="h-8 w-8 animate-pulse border-2 border-primary/40 bg-surface/40" />
    </div>
  )
}
