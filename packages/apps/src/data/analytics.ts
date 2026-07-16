export const analyticsKpis = [
  {
    label: 'AVERAGE RESPONSE TIME',
    value: '42',
    unit: 'm',
    delta: '↓ 12%',
    tone: 'down' as const,
    note: 'VS LAST 24H',
  },
  {
    label: 'SLA ACHIEVEMENT',
    value: '98.4',
    unit: '%',
    delta: '↑ 0.8%',
    tone: 'up' as const,
    note: 'SYSTEM HEALTHY',
  },
  {
    label: 'TICKETS RESOLVED',
    value: '1,284',
    unit: '',
    delta: 'VERIFIED',
    tone: 'flat' as const,
    note: 'NODE: AX-770',
  },
]

export type TrendPoint = { day: string; incoming: number; resolved: number }

export const resolutionTrend: TrendPoint[] = [
  { day: 'MON', incoming: 20, resolved: 15 },
  { day: 'TUE', incoming: 28, resolved: 22 },
  { day: 'WED', incoming: 55, resolved: 40 },
  { day: 'THU', incoming: 50, resolved: 38 },
  { day: 'FRI', incoming: 62, resolved: 50 },
  { day: 'SAT', incoming: 68, resolved: 58 },
  { day: 'SUN', incoming: 60, resolved: 52 },
]

export const peakLoadIndex = 5

export const sentimentDistribution = [
  { label: 'POSITIVE', pct: 64, tone: 'ok' as const },
  { label: 'NEUTRAL', pct: 28, tone: 'neutral' as const },
  { label: 'FRUSTRATED', pct: 8, tone: 'warn' as const },
]

export const sentimentNote = 'AI Agent "Aurora" is managing sentiment overflow efficiently.'

export type IncidentRow = {
  id: string
  priority: 'urgent' | 'normal' | 'low'
  category: string
  timeToBreach: string
  status: 'ESCALATED' | 'ACTIVE' | 'QUEUED' | 'RESOLVED'
  engineer: string
}

export const activeIncidents: IncidentRow[] = [
  { id: '#AX-2094', priority: 'urgent', category: 'INFRASTRUCTURE', timeToBreach: '00:14:22', status: 'ESCALATED', engineer: 'J. Miller' },
  { id: '#AX-2088', priority: 'normal', category: 'BACKEND', timeToBreach: '02:45:00', status: 'ACTIVE', engineer: 'S. Chen' },
  { id: '#AX-2075', priority: 'low', category: 'FRONTEND', timeToBreach: '08:12:15', status: 'QUEUED', engineer: 'R. Vance' },
  { id: '#AX-2061', priority: 'normal', category: 'LOGIC', timeToBreach: 'PAUSED', status: 'RESOLVED', engineer: 'AI-AUTO' },
]

export const categoryBreakdown = [
  { label: 'INFRA', pct: 38 },
  { label: 'BACKEND', pct: 27 },
  { label: 'FRONTEND', pct: 20 },
  { label: 'LOGIC', pct: 15 },
]

export const clusterTags = [
  { label: 'NODE-ALPHA-7', tone: 'ok' as const },
  { label: 'US-EAST-1', tone: 'ok' as const },
  { label: 'LATENCY_HIGH', tone: 'warn' as const },
]

export const clusterStatus = [
  { label: 'SESSION ID', value: 'AX-882-K9-0128' },
  { label: 'ENCRYPTION', value: 'AES-256-GCM (VER. 4.2)' },
  { label: 'LAST SYNC', value: 'T-MINUS 00:00:04' },
]
