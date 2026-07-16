import type { Priority } from './tickets'

export type Kpi = { label: string; value: string; delta: string; tone: 'up' | 'down' }

export const kpis: Kpi[] = [
  { label: 'Open Tickets', value: '47', delta: '+12%', tone: 'up' },
  { label: 'Avg Response Time', value: '2.4h', delta: '-8%', tone: 'down' },
  { label: 'Resolved Today', value: '23', delta: '+5%', tone: 'up' },
  { label: 'CSAT Score', value: '94%', delta: '+2%', tone: 'up' },
]

export type VolumeBar = { day: string; height: number; tone: 'ok' | 'warn' }

export const volumeChart: VolumeBar[] = [
  { day: 'MON', height: 32, tone: 'ok' },
  { day: 'TUE', height: 48, tone: 'ok' },
  { day: 'WED', height: 40, tone: 'ok' },
  { day: 'THU', height: 62, tone: 'warn' },
  { day: 'FRI', height: 55, tone: 'warn' },
  { day: 'SAT', height: 24, tone: 'ok' },
  { day: 'SUN', height: 18, tone: 'ok' },
]

export const priorityBreakdown: Array<{ priority: Priority; count: number }> = [
  { priority: 'urgent', count: 8 },
  { priority: 'medium', count: 19 },
  { priority: 'low', count: 14 },
  { priority: 'resolved', count: 6 },
]

export type ActivityItem = { id: string; ticketCode: string; label: string; time: string }

export const recentActivity: ActivityItem[] = [
  { id: 'a1', ticketCode: 'Ticket 12845', label: 'Escalated to Infrastructure', time: '3M AGO' },
  { id: 'a2', ticketCode: 'Ticket 12842', label: 'Reply sent by Marcus Vance', time: '18M AGO' },
  { id: 'a3', ticketCode: 'Ticket 12839', label: 'Priority downgraded to LOW', time: '41M AGO' },
  { id: 'a4', ticketCode: 'Ticket 12835', label: 'Resolved and closed', time: '1H AGO' },
]
