export type Priority = 'urgent' | 'medium' | 'low' | 'resolved'

export type TicketCategory = 'bug' | 'feature-request'

export const CURRENT_AGENT = 'Alex Morgan'

export type MessagePart = { text: string; code?: boolean; danger?: boolean }

export type Channel = 'email' | 'chat' | 'note'

export type EmailHeaders = { from: string; to: string; cc?: string; bcc?: string }

export type ThreadMessage = {
  id: string
  from: 'customer' | 'agent'
  name: string
  time: string
  channel?: Channel
  email?: EmailHeaders
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

export type TicketRecord = {
  id: string
  systemCode: string
  title: string
  priority: Priority
  category: TicketCategory
  assignee: string
  meta: string
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
}

export const tickets: TicketRecord[] = [
  {
    id: '12845',
    systemCode: 'DB_CONN_TIMEOUT_PROD',
    title: 'Database connection timeouts in Production',
    priority: 'urgent',
    category: 'bug',
    assignee: 'Marcus Vance',
    meta: 'SLA breached • 12m ago',
    messages: [
      {
        id: 'm1',
        from: 'customer',
        name: 'Alex Thompson',
        time: '10:42 UTC',
        channel: 'email',
        email: { from: 'alex.thompson@nimbuscloud.io', to: 'support@ax10.in' },
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
      badge: 'AI Suggestion',
      body: 'The telemetry suggests a deadlock in the transaction manager. Specifically, the `billing_v2` table is holding locks longer than expected. Suggest checking the recently deployed hotfix in the adapter service.',
      actions: [
        { label: 'Apply Reply', tone: 'default' },
        { label: 'Refine', tone: 'default' },
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
  },
  {
    id: '12842',
    systemCode: 'MOBILE_LOGIN_FLICKER_IOS17',
    title: 'Mobile app login flickering on iOS 17',
    priority: 'medium',
    category: 'bug',
    assignee: 'Alex Morgan',
    meta: 'Resolution due • 2h',
    messages: [
      {
        id: 'm1',
        from: 'customer',
        name: 'Priya Nair',
        time: '09:10 UTC',
        channel: 'email',
        email: { from: 'priya.nair@clientco.io', to: 'support@ax10.in' },
        parts: [
          {
            text: "After updating to iOS 17, the login screen flickers between the splash view and the form for about a second before settling. Doesn't happen on iOS 16.",
          },
        ],
      },
      {
        id: 'm2',
        from: 'agent',
        name: 'Marcus Vance',
        time: '09:32 UTC',
        channel: 'email',
        email: { from: 'marcus.vance@ax10.in', to: 'priya.nair@clientco.io' },
        parts: [
          {
            text: 'Thanks for the details, Priya. Can you confirm which device model you\'re on? We have a lead on an ' },
          { text: 'UIViewController', code: true },
          { text: ' lifecycle change in iOS 17 that could explain the double render.' },
        ],
      },
      {
        id: 'm3',
        from: 'customer',
        name: 'Priya Nair',
        time: '09:40 UTC',
        channel: 'email',
        email: { from: 'priya.nair@clientco.io', to: 'support@ax10.in', cc: 'devteam@clientco.io' },
        parts: [{ text: 'iPhone 14 Pro, but a colleague saw it on an iPhone 12 too.' }],
      },
    ],
    aiSuggestion: {
      badge: 'AI Suggestion',
      body: 'Crash-free session data shows this is cosmetic only, no auth failures recorded. Suggest sharing the known iOS 17 `viewDidAppear` workaround already merged in the mobile hotfix branch.',
      actions: [
        { label: 'Apply Reply', tone: 'default' },
        { label: 'Refine', tone: 'default' },
      ],
    },
    ai: {
      confidence: 76.2,
      sentiment: 'NEUTRAL',
      sentimentNote: 'No churn risk detected',
      summaryParts: [
        { text: 'Cosmetic rendering glitch on ' },
        { text: 'iOS 17', highlight: true },
        { text: ' login flow. No authentication or data-loss impact. Fix already staged in ' },
        { text: 'mobile-hotfix branch', underline: true },
        { text: '. Resolution status: ' },
        { text: 'IN PROGRESS', highlight: true },
        { text: '.' },
      ],
      actions: [
        { label: 'Share Known Workaround', tone: 'default' },
        { label: 'Link to Mobile Hotfix Branch', tone: 'default' },
      ],
      telemetry: [
        { height: 12, tone: 'ok' },
        { height: 15, tone: 'ok' },
        { height: 14, tone: 'ok' },
        { height: 17, tone: 'ok' },
        { height: 13, tone: 'ok' },
        { height: 16, tone: 'ok' },
        { height: 15, tone: 'ok' },
      ],
    },
  },
  {
    id: '12839',
    systemCode: 'API_DOCS_TYPO_AUTH',
    title: 'API documentation typo in Auth section',
    priority: 'low',
    category: 'bug',
    assignee: 'Alex Morgan',
    meta: 'Resolution due • 5h',
    messages: [
      {
        id: 'm1',
        from: 'customer',
        name: 'Devon Ruiz',
        time: '08:02 UTC',
        channel: 'note',
        parts: [
          { text: 'The Auth guide references ' },
          { text: 'refresh_token', code: true },
          { text: ' as a query param, but the endpoint actually expects it in the request body. Minor, but tripped up two of our devs.' },
        ],
      },
      {
        id: 'm2',
        from: 'agent',
        name: 'Marcus Vance',
        time: '08:15 UTC',
        channel: 'note',
        parts: [{ text: 'Good catch, thank you. Filing a docs fix now.' }],
      },
    ],
    aiSuggestion: {
      badge: 'AI Suggestion',
      body: 'This is a documentation-only correction with no code or customer-data impact. Suggest closing with a thank-you note and linking the docs PR once merged.',
      actions: [
        { label: 'Apply Reply', tone: 'default' },
        { label: 'Refine', tone: 'default' },
      ],
    },
    ai: {
      confidence: 99.1,
      sentiment: 'POSITIVE',
      sentimentNote: 'Customer flagged proactively, no escalation risk',
      summaryParts: [
        { text: 'Documentation error in Auth guide: ' },
        { text: 'refresh_token', highlight: true },
        { text: ' placement described incorrectly. No functional or security impact. Resolution status: ' },
        { text: 'DOCS FIX QUEUED', highlight: true },
        { text: '.' },
      ],
      actions: [{ label: 'Close With Thank-You Note', tone: 'default' }],
      telemetry: [
        { height: 6, tone: 'ok' },
        { height: 7, tone: 'ok' },
        { height: 5, tone: 'ok' },
        { height: 8, tone: 'ok' },
        { height: 6, tone: 'ok' },
        { height: 7, tone: 'ok' },
        { height: 6, tone: 'ok' },
      ],
    },
  },
  {
    id: '12835',
    systemCode: 'STRIPE_WEBHOOK_VERIFY_FAIL',
    title: 'Stripe webhook verification failure',
    priority: 'resolved',
    category: 'bug',
    assignee: 'Marcus Vance',
    meta: 'Closed • 1h ago',
    messages: [
      {
        id: 'm1',
        from: 'customer',
        name: 'Jordan Blake',
        time: 'Yesterday, 16:20 UTC',
        channel: 'email',
        email: { from: 'jordan.blake@paylytics.io', to: 'support@ax10.in' },
        parts: [
          { text: 'Getting ' },
          { text: 'signature verification failed', danger: true },
          { text: ' on every incoming Stripe webhook since this morning.' },
        ],
      },
      {
        id: 'm2',
        from: 'agent',
        name: 'Marcus Vance',
        time: 'Yesterday, 17:05 UTC',
        channel: 'email',
        email: {
          from: 'marcus.vance@ax10.in',
          to: 'jordan.blake@paylytics.io',
          cc: 'billing-ops@ax10.in',
          bcc: 'compliance@ax10.in',
        },
        parts: [
          { text: 'Root cause was a stale ' },
          { text: 'STRIPE_WEBHOOK_SECRET', code: true },
          { text: ' in the production env after last week\'s key rotation. Rotated env var and redeployed — verification is passing now.' },
        ],
      },
      {
        id: 'm3',
        from: 'customer',
        name: 'Jordan Blake',
        time: 'Yesterday, 17:12 UTC',
        channel: 'email',
        email: { from: 'jordan.blake@paylytics.io', to: 'support@ax10.in' },
        parts: [{ text: 'Confirmed working on our end too. Thanks for the quick turnaround.' }],
      },
    ],
    aiSuggestion: {
      badge: 'AI Suggestion',
      body: 'Thread indicates customer-confirmed resolution. Suggest closing the ticket and adding the key-rotation runbook step to prevent recurrence.',
      actions: [
        { label: 'Close Ticket', tone: 'default' },
        { label: 'Refine', tone: 'default' },
      ],
    },
    ai: {
      confidence: 95.7,
      sentiment: 'SATISFIED',
      sentimentNote: 'Customer confirmed fix, ticket closed',
      summaryParts: [
        { text: 'Webhook signature failures traced to stale ' },
        { text: 'STRIPE_WEBHOOK_SECRET', highlight: true },
        { text: ' after key rotation. Fixed via env var update and redeploy. Resolution status: ' },
        { text: 'RESOLVED', highlight: true },
        { text: '.' },
      ],
      actions: [{ label: 'Reopen Ticket', tone: 'danger' }],
      telemetry: [
        { height: 30, tone: 'warn' },
        { height: 28, tone: 'warn' },
        { height: 10, tone: 'ok' },
        { height: 9, tone: 'ok' },
        { height: 8, tone: 'ok' },
        { height: 9, tone: 'ok' },
        { height: 8, tone: 'ok' },
      ],
    },
  },
  {
    id: '12851',
    systemCode: 'CSV_EXPORT_TICKET_QUEUE',
    title: 'Add CSV export for the ticket queue',
    priority: 'low',
    category: 'feature-request',
    assignee: 'Alex Morgan',
    meta: 'Requested • 3d ago',
    messages: [
      {
        id: 'm1',
        from: 'customer',
        name: 'Rina Kapoor',
        time: 'Mon, 14:05 UTC',
        channel: 'email',
        email: { from: 'rina.kapoor@lattice-ops.com', to: 'support@ax10.in' },
        parts: [
          {
            text: "We run weekly reporting off ticket volume and priority. Right now we're screenshotting the queue, which doesn't scale. Could you add a CSV export for the current view?",
          },
        ],
      },
      {
        id: 'm2',
        from: 'agent',
        name: 'Alex Morgan',
        time: 'Mon, 15:40 UTC',
        channel: 'email',
        email: { from: 'alex.morgan@ax10.in', to: 'rina.kapoor@lattice-ops.com' },
        parts: [
          {
            text: 'Makes sense — logging this as a feature request. Filtered export (by queue and priority) is on our roadmap for next sprint.',
          },
        ],
      },
    ],
    aiSuggestion: {
      badge: 'AI Suggestion',
      body: 'Recurring ask from three accounts this quarter. Suggest tagging as a roadmap item and giving the customer a target sprint instead of an open-ended timeline.',
      actions: [
        { label: 'Add to Roadmap', tone: 'default' },
        { label: 'Refine', tone: 'default' },
      ],
    },
    ai: {
      confidence: 88.3,
      sentiment: 'POSITIVE',
      sentimentNote: 'Customer patient, no urgency signal',
      summaryParts: [
        { text: 'Feature request: ' },
        { text: 'CSV export', highlight: true },
        { text: ' for the ticket queue view, filtered by priority. Requested by 3 accounts this quarter. Resolution status: ' },
        { text: 'ON ROADMAP', highlight: true },
        { text: '.' },
      ],
      actions: [{ label: 'Link to Roadmap Ticket', tone: 'default' }],
      telemetry: [
        { height: 8, tone: 'ok' },
        { height: 9, tone: 'ok' },
        { height: 7, tone: 'ok' },
        { height: 8, tone: 'ok' },
        { height: 9, tone: 'ok' },
        { height: 8, tone: 'ok' },
        { height: 7, tone: 'ok' },
      ],
    },
  },
]

export type QueueKey = 'all' | 'mine' | 'urgent' | 'bugs' | 'features'

export const queueFilters: Record<QueueKey, (t: TicketRecord) => boolean> = {
  all: () => true,
  mine: (t) => t.assignee === CURRENT_AGENT,
  urgent: (t) => t.priority === 'urgent',
  bugs: (t) => t.category === 'bug',
  features: (t) => t.category === 'feature-request',
}

export const queueNav = [
  { key: 'all' as const, label: 'All Tickets', icon: 'inbox' as const },
  { key: 'mine' as const, label: 'My Queue', icon: 'user' as const },
  { key: 'urgent' as const, label: 'Urgent', icon: 'alert' as const },
  { key: 'bugs' as const, label: 'Bugs', icon: 'bug' as const },
  { key: 'features' as const, label: 'Feature Requests', icon: 'check' as const },
]
