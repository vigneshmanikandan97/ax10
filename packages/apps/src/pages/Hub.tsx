import { Link } from 'react-router-dom'
import { ArrowUpRight, LifeBuoy, ShoppingCart, BarChart3, Calendar, Package } from 'lucide-react'

type Demo = {
  name: string
  description: string
  href: string
  icon: typeof LifeBuoy
  live: boolean
}

const demos: Demo[] = [
  {
    name: 'Support',
    description: 'AI-triaged ticket queue with suggested replies and confidence scoring.',
    href: '/support',
    icon: LifeBuoy,
    live: true,
  },
  {
    name: 'E-commerce',
    description: 'Storefront, cart, and checkout flow.',
    href: '#',
    icon: ShoppingCart,
    live: false,
  },
  {
    name: 'Analytics',
    description: 'Dashboard with KPI tiles, charts, and filters.',
    href: '#',
    icon: BarChart3,
    live: false,
  },
  {
    name: 'Booking',
    description: 'Scheduling and appointment flow.',
    href: '#',
    icon: Calendar,
    live: false,
  },
  {
    name: 'Orders',
    description: 'Order management and tracking.',
    href: '#',
    icon: Package,
    live: false,
  },
]

export function Hub() {
  return (
    <main className="mx-auto flex min-h-screen max-w-container-max flex-col px-margin-mobile py-16 md:px-margin-desktop">
      <p className="mb-4 font-label-caps text-label-caps uppercase text-primary">AX10 Apps</p>
      <h1 className="type-display max-w-2xl text-4xl font-display leading-none md:text-6xl">
        Sample applications, built the AX10 way
      </h1>
      <p className="mt-5 max-w-lg text-body-lg text-text-secondary">
        Live, working demos of what we build for clients. Static data, real UI, no backend
        required.
      </p>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demos.map((demo) => {
          const Icon = demo.icon
          const cardClass = `group relative flex flex-col justify-between rounded-2xl border-2 border-border-subtle bg-surface p-6 transition-all duration-300 ${
            demo.live
              ? 'cursor-pointer hover:-translate-x-1 hover:-translate-y-1 hover:border-primary hover:shadow-brutal-primary'
              : 'opacity-50'
          }`
          const cardBody = (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <Icon className="h-6 w-6 text-primary" strokeWidth={1.75} />
                {demo.live ? (
                  <ArrowUpRight className="h-4 w-4 text-text-muted transition-colors group-hover:text-primary" />
                ) : (
                  <span className="font-label-mono text-[10px] uppercase tracking-wider text-text-muted">
                    Soon
                  </span>
                )}
              </div>
              <h2 className="type-headline text-lg font-semibold text-text-primary">
                {demo.name}
              </h2>
              <p className="mt-1.5 text-sm text-text-secondary">{demo.description}</p>
            </div>
          )

          return demo.live ? (
            <Link key={demo.name} to={demo.href} className={cardClass}>
              {cardBody}
            </Link>
          ) : (
            <div key={demo.name} className={cardClass}>
              {cardBody}
            </div>
          )
        })}
      </div>

      <a
        href="https://www.ax10.in/contact"
        className="mt-16 inline-block self-start border border-primary px-6 py-3 font-label-mono text-label-mono uppercase text-primary transition-colors hover:bg-primary hover:text-surface-deep"
      >
        Talk to us
      </a>
    </main>
  )
}
