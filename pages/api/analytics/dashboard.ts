import type { NextApiRequest, NextApiResponse } from 'next'
import type { DashboardData, AnalyticsEvent, DashboardFilters } from '../../../types/analytics'

// Shared in-memory storage for events (replace with database in production)
export const events: AnalyticsEvent[] = []

// This function would typically be shared or imported from the events handler
function getStoredEvents(): AnalyticsEvent[] {
  try {
    // In a real implementation, this would query your database
    // For now, we'll use the same in-memory storage as the events API
    console.log(`📊 Dashboard: Retrieved ${events.length} events from storage`)
    return events
  } catch (error) {
    console.error('Error retrieving stored events:', error)
    return []
  }
}

function filterEvents(events: AnalyticsEvent[], filters?: Partial<DashboardFilters>): AnalyticsEvent[] {
  let filteredEvents = [...events]
  
  console.log(`📊 Filter: Starting with ${events.length} events`)
  console.log('📊 Filter: Filters provided:', filters)
  
  if (filters?.dateRange) {
    console.log(`📊 Filter: Date range - ${filters.dateRange.start} to ${filters.dateRange.end}`)
    const startTime = filters.dateRange.start.getTime()
    // Add a buffer to the end time to include events created after the filter was created
    const endTime = filters.dateRange.end.getTime() + (5 * 60 * 1000) // Add 5 minutes buffer
    const beforeFilter = filteredEvents.length
    filteredEvents = filteredEvents.filter(event => {
      const eventTime = new Date(event.timestamp).getTime()
      const inRange = eventTime >= startTime && eventTime <= endTime
      if (!inRange) {
        console.log(`📊 Filter: Event ${event.id} (${event.timestamp}) outside range`)
        console.log(`📊 Filter: Event time: ${eventTime}, Start: ${startTime}, End: ${endTime}`)
      }
      return inRange
    })
    console.log(`📊 Filter: Date filter removed ${beforeFilter - filteredEvents.length} events`)
  }

  if (filters?.alertIds?.length) {
    filteredEvents = filteredEvents.filter(event => 
      !event.alertId || filters.alertIds!.includes(event.alertId)
    )
  }

  if (filters?.featureNames?.length) {
    filteredEvents = filteredEvents.filter(event => 
      !event.featureName || filters.featureNames!.includes(event.featureName)
    )
  }

  if (filters?.environment) {
    filteredEvents = filteredEvents.filter(event => 
      event.userAttributes?.environment === filters.environment
    )
  }

  return filteredEvents
}

function calculateDashboardData(events: AnalyticsEvent[], filters?: Partial<DashboardFilters>): DashboardData {
  const filteredEvents = filterEvents(events, filters)
  
  console.log(`📊 Dashboard API: Processing ${filteredEvents.length} filtered events`)
  console.log('📊 Event types:', filteredEvents.map(e => e.type))
  
  // Calculate overview metrics
  const alertEvents = filteredEvents.filter(e => e.type.startsWith('alert_'))
  const featureEvents = filteredEvents.filter(e => e.type.startsWith('feature_'))
  const alertShows = alertEvents.filter(e => e.type === 'alert_show').length
  const alertHides = alertEvents.filter(e => e.type === 'alert_hide').length
  const featureChecks = featureEvents.filter(e => e.type === 'feature_check').length
  const uniqueUsers = new Set(filteredEvents.map(e => e.userId).filter(Boolean)).size
  const uniqueSessions = new Set(filteredEvents.map(e => e.sessionId)).size
  
  console.log(`📊 Calculated metrics: alertEvents=${alertEvents.length}, featureEvents=${featureEvents.length}, alertShows=${alertShows}, alertHides=${alertHides}, featureChecks=${featureChecks}, uniqueUsers=${uniqueUsers}`)

  const overview = {
    totalAlerts: new Set(alertEvents.map(e => e.alertId).filter(Boolean)).size,
    alertShows,
    alertHides,
    alertDismissalRate: alertShows > 0 ? (alertHides / alertShows) * 100 : 0,
    totalFeatureChecks: featureChecks,
    activeFeatures: new Set(featureEvents.map(e => e.featureName).filter(Boolean)).size,
    featureAdoptionRate: featureChecks > 0 ? (featureEvents.filter(e => e.featureEnabled).length / featureChecks) * 100 : 0,
    uniqueUsers,
    sessionCount: uniqueSessions,
    dateRange: {
      start: filters?.dateRange?.start.toISOString() || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      end: filters?.dateRange?.end.toISOString() || new Date().toISOString()
    }
  }

  // Calculate segment metrics
  const segmentMap = new Map<string, { shows: number, hides: number, checks: number }>()
  
  filteredEvents.forEach(event => {
    if (!event.userAttributes) return

    Object.entries(event.userAttributes).forEach(([key, value]) => {
      if (!value || key === 'currentPage') return
      
      const segmentKey = `${key}:${value}`
      const existing = segmentMap.get(segmentKey) || { shows: 0, hides: 0, checks: 0 }
      
      if (event.type === 'alert_show') existing.shows++
      if (event.type === 'alert_hide') existing.hides++
      if (event.type === 'feature_check') existing.checks++
      
      segmentMap.set(segmentKey, existing)
    })
  })

  const segments = Array.from(segmentMap.entries()).map(([segment, data]) => {
    const [key, value] = segment.split(':')
    return {
      segment: key,
      value,
      alertShows: data.shows,
      alertHides: data.hides,
      featureChecks: data.checks,
      engagementRate: data.shows > 0 ? ((data.shows - data.hides) / data.shows) * 100 : 0
    }
  }).sort((a, b) => b.engagementRate - a.engagementRate)

  // Calculate time series data
  const dayMap = new Map<string, { shows: number, hides: number, checks: number, users: Set<string> }>()

  filteredEvents.forEach(event => {
    const day = event.timestamp.split('T')[0]
    const existing = dayMap.get(day) || { shows: 0, hides: 0, checks: 0, users: new Set() }
    
    if (event.type === 'alert_show') existing.shows++
    if (event.type === 'alert_hide') existing.hides++
    if (event.type === 'feature_check') existing.checks++
    if (event.userId) existing.users.add(event.userId)
    
    dayMap.set(day, existing)
  })

  const timeSeries = Array.from(dayMap.entries())
    .map(([timestamp, data]) => ({
      timestamp,
      alertShows: data.shows,
      alertHides: data.hides,
      featureChecks: data.checks,
      uniqueUsers: data.users.size
    }))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp))

  // Calculate top alerts
  const alertMap = new Map<string, { title: string, shows: number, dismissals: number }>()

  alertEvents.forEach(event => {
    if (!event.alertId) return
    
    const existing = alertMap.get(event.alertId) || { 
      title: event.alertTitle || 'Unknown Alert', 
      shows: 0, 
      dismissals: 0 
    }
    
    if (event.type === 'alert_show') existing.shows++
    if (event.type === 'alert_hide') existing.dismissals++
    
    alertMap.set(event.alertId, existing)
  })

  const topAlerts = Array.from(alertMap.entries())
    .map(([id, data]) => ({
      id,
      title: data.title,
      shows: data.shows,
      dismissals: data.dismissals,
      dismissalRate: data.shows > 0 ? (data.dismissals / data.shows) * 100 : 0
    }))
    .sort((a, b) => b.shows - a.shows)
    .slice(0, 10)

  // Calculate top features
  const featureMap = new Map<string, { checks: number, enabledCount: number }>()

  featureEvents.forEach(event => {
    if (!event.featureName || event.type !== 'feature_check') return
    
    const existing = featureMap.get(event.featureName) || { checks: 0, enabledCount: 0 }
    existing.checks++
    if (event.featureEnabled) existing.enabledCount++
    
    featureMap.set(event.featureName, existing)
  })

  const topFeatures = Array.from(featureMap.entries())
    .map(([name, data]) => ({
      name,
      checks: data.checks,
      enabledCount: data.enabledCount,
      adoptionRate: data.checks > 0 ? (data.enabledCount / data.checks) * 100 : 0
    }))
    .sort((a, b) => b.checks - a.checks)
    .slice(0, 10)

  // Recent events
  const recentEvents = filteredEvents
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 50)

  return {
    overview,
    segments,
    timeSeries,
    topAlerts,
    topFeatures,
    recentEvents
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const filters: Partial<DashboardFilters> = req.body

      // Parse date strings back to Date objects if provided
      if (filters.dateRange) {
        if (typeof filters.dateRange.start === 'string') {
          filters.dateRange.start = new Date(filters.dateRange.start)
        }
        if (typeof filters.dateRange.end === 'string') {
          filters.dateRange.end = new Date(filters.dateRange.end)
        }
      }

      const storedEvents = getStoredEvents()
      const dashboardData = calculateDashboardData(storedEvents, filters)

      res.status(200).json(dashboardData)
    } catch (error) {
      console.error('Error generating dashboard data:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'GET') {
    try {
      // Default to last 30 days with buffer for current events
      const defaultFilters: Partial<DashboardFilters> = {
        dateRange: {
          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          end: new Date(Date.now() + 5 * 60 * 1000) // Add 5 minutes to include recent events
        }
      }

      const storedEvents = getStoredEvents()
      const dashboardData = calculateDashboardData(storedEvents, defaultFilters)

      res.status(200).json(dashboardData)
    } catch (error) {
      console.error('Error generating dashboard data:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ error: 'Method not allowed' })
  }
}

