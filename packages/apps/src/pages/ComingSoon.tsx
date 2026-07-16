export function ComingSoon() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-margin-mobile text-center md:px-margin-desktop">
      <p className="mb-6 font-label-caps text-label-caps uppercase text-primary">
        AX10 Apps
      </p>
      <h1 className="type-display text-5xl font-display leading-none md:text-7xl">
        Live demo — Coming soon
      </h1>
      <p className="mt-6 max-w-md text-body-lg text-text-secondary">
        We're building sample applications to show what AX10 can craft for you.
        Check back shortly.
      </p>
      <a
        href="https://www.ax10.in/contact"
        className="mt-10 inline-block border border-primary px-6 py-3 font-label-mono text-label-mono uppercase text-primary transition-colors hover:bg-primary hover:text-surface-deep"
      >
        Talk to us
      </a>
    </main>
  )
}
