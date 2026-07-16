export type Priority = 'urgent' | 'medium' | 'low' | 'resolved'

export type QueueTicket = {
  id: string
  code: string
  title: string
  priority: Priority
  meta: string
  active?: boolean
}

export type MessagePart = { text: string; code?: boolean; danger?: boolean }

export type Channel = 'email' | 'chat' | 'note'

export type ThreadMessage = {
  id: string
  from: 'customer' | 'agent'
  name: string
  time: string
  channel?: Channel
  parts: MessagePart[]
}

export type AiAction = {
  label: string
  tone: 'default' | 'danger'
}

export type TelemetryBar = {
  height: number
  tone: 'ok' | 'warn'
}

export type Ticket = {
  id: string
  code: string
  slug: string
  queueLabel: string
  activeCount: number
  messages: ThreadMessage[]
  aiSuggestion: { badge: string; body: string; actions: [AiAction, AiAction] }
  ai: {
    confidence: number
    sentiment: string
    sentimentNote: string
    summaryParts: Array<{ text: string; highlight?: boolean; danger?: boolean; underline?: boolean }>
    actions: AiAction[]
    telemetry: TelemetryBar[]
  }
  queue: QueueTicket[]
}

export const ticket: Ticket = {
  id: '12845',
  code: 'DB_CONN_TIMEOUT_PROD',
  slug: 'Ticket 12845',
  queueLabel: 'Engineering Support',
  activeCount: 14,
  messages: [
    {
      id: 'm1',
      from: 'customer',
      name: 'Alex Thompson',
      time: '10:42 UTC',
      channel: 'email',
      parts: [
        { text: 'Our production cluster in ' },
        { text: 'us-west-2', code: true },
        { text: ' is experiencing widespread connection timeouts. The logs show ' },
        { text: 'ETIMEDOUT', danger: true },
        { text: ' across all billing services. Resource limits seem fine but latency is spiking over 2000ms.' },
      ],
    },
    {
      id: 'm2',
      from: 'agent',
      name: 'Marcus Vance',
      time: '10:45 UTC',
      channel: 'chat',
      parts: [
        {
          text: "Acknowledged. I'm checking the RDS metrics now. It looks like a connection pool saturation. Have there been any recent migrations or high-volume batch jobs triggered?",
        },
      ],
    },
  ],
  aiSuggestion: {
    badge: 'AI SUGGESTION',
    body: 'The telemetry suggests a deadlock in the transaction manager. Specifically, the `billing_v2` table is holding locks longer than expected. Suggest checking the recently deployed hotfix in the adapter service.',
    actions: [
      { label: 'Apply Reply', tone: 'default' },
      { label: 'REFINE', tone: 'default' },
    ],
  },
  ai: {
    confidence: 98.4,
    sentiment: 'FRUSTRATED',
    sentimentNote: 'Escalation likely within 15m',
    summaryParts: [
      { text: 'Database pool saturation in ' },
      { text: 'us-west-2', highlight: true },
      { text: '. High latency affecting billing processing. Correlation found with ' },
      { text: 'Deployment #88-AX', underline: true },
      { text: '. Resolution status: ' },
      { text: 'PENDING', danger: true },
      { text: '.' },
    ],
    actions: [
      { label: 'Escalate to Infrastructure', tone: 'default' },
      { label: 'Request Debug Logs', tone: 'default' },
      { label: 'Trigger Rollback', tone: 'danger' },
    ],
    telemetry: [
      { height: 18, tone: 'ok' },
      { height: 27, tone: 'ok' },
      { height: 24, tone: 'ok' },
      { height: 38, tone: 'ok' },
      { height: 53, tone: 'warn' },
      { height: 50, tone: 'warn' },
      { height: 56, tone: 'warn' },
    ],
  },
  queue: [
    {
      id: '12845',
      code: 'Ticket 12845',
      title: 'Database connection timeouts in Production',
      priority: 'urgent',
      meta: 'SLA BREACHED • 12M AGO',
      active: true,
    },
    {
      id: '12842',
      code: 'Ticket 12842',
      title: 'Mobile app login flickering on iOS 17',
      priority: 'medium',
      meta: 'RESOLUTION DUE • 2H',
    },
    {
      id: '12839',
      code: 'Ticket 12839',
      title: 'API documentation typo in Auth section',
      priority: 'low',
      meta: 'RESOLUTION DUE • 5H',
    },
    {
      id: '12835',
      code: 'Ticket 12835',
      title: 'Stripe webhook verification failure',
      priority: 'resolved',
      meta: 'CLOSED • 1H AGO',
    },
  ],
}

export const queueNav = [
  { label: 'All Tickets', icon: 'inbox' as const },
  { label: 'My Queue', icon: 'user' as const },
  { label: 'Urgent', icon: 'alert' as const },
  { label: 'Bugs', icon: 'bug' as const },
  { label: 'Feature Requests', icon: 'check' as const },
]
