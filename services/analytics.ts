import type { AnalyticsEvent, DashboardData, DashboardFilters } from '../types/analytics'

class AnalyticsService {
  private events: AnalyticsEvent[] = []
  private isEnabled: boolean = true
  private sessionId: string
  private userId?: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadPersistedEvents()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  private loadPersistedEvents(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('windingo_analytics_events')
        if (stored) {
          this.events = JSON.parse(stored)
        }
      } catch (error) {
        console.error('Failed to load persisted analytics events:', error)
      }
    }
  }

  private persistEvents(): void {
    if (typeof window !== 'undefined') {
      try {
        // Keep only last 1000 events to prevent storage bloat
        const eventsToStore = this.events.slice(-1000)
        localStorage.setItem('windingo_analytics_events', JSON.stringify(eventsToStore))
      } catch (error) {
        console.error('Failed to persist analytics events:', error)
      }
    }
  }

  setUserId(userId: string): void {
    this.userId = userId
  }

  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled
  }

  private track(event: Omit<AnalyticsEvent, 'id' | 'timestamp' | 'sessionId' | 'userId'>): void {
    if (!this.isEnabled) return

    const analyticsEvent: AnalyticsEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }

    this.events.push(analyticsEvent)
    this.persistEvents()

    // Send to server if API is available
    this.sendToServer(analyticsEvent).catch(error => {
      console.warn('Failed to send analytics event to server:', error)
    })
  }

  private async sendToServer(event: AnalyticsEvent): Promise<void> {
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })
    } catch (error) {
      // Silently fail - events are still stored locally
      throw error
    }
  }

  // Alert tracking methods
  trackAlertShow(alertId: string, alertTitle: string, alertTheme: string, userAttributes?: any): void {
    this.track({
      type: 'alert_show',
      alertId,
      alertTitle,
      alertTheme,
      userAttributes
    })
  }

  trackAlertHide(alertId: string, userAttributes?: any): void {
    this.track({
      type: 'alert_hide',
      alertId,
      userAttributes
    })
  }

  trackAlertError(error: string, userAttributes?: any): void {
    this.track({
      type: 'alert_error',
      userAttributes,
      metadata: { error }
    })
  }

  // Feature toggle tracking methods
  trackFeatureCheck(featureName: string, featureEnabled: boolean, userAttributes?: any): void {
    this.track({
      type: 'feature_check',
      featureName,
      featureEnabled,
      userAttributes
    })
  }

  trackFeatureChange(features: Record<string, boolean>, userAttributes?: any): void {
    Object.entries(features).forEach(([featureName, featureEnabled]) => {
      this.track({
        type: 'feature_change',
        featureName,
        featureEnabled,
        userAttributes
      })
    })
  }

  trackFeatureError(error: string, userAttributes?: any): void {
    this.track({
      type: 'feature_error',
      userAttributes,
      metadata: { error }
    })
  }

  // Data retrieval methods
  getEvents(filters?: Partial<DashboardFilters>): AnalyticsEvent[] {
    let filteredEvents = [...this.events]

    if (filters?.dateRange) {
      const startTime = filters.dateRange.start.getTime()
      const endTime = filters.dateRange.end.getTime()
      filteredEvents = filteredEvents.filter(event => {
        const eventTime = new Date(event.timestamp).getTime()
        return eventTime >= startTime && eventTime <= endTime
      })
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

  async getDashboardData(filters?: DashboardFilters): Promise<DashboardData> {
    const events = this.getEvents(filters)
    
    // Calculate overview metrics
    const alertEvents = events.filter(e => e.type.startsWith('alert_'))
    const featureEvents = events.filter(e => e.type.startsWith('feature_'))
    const alertShows = alertEvents.filter(e => e.type === 'alert_show').length
    const alertHides = alertEvents.filter(e => e.type === 'alert_hide').length
    const featureChecks = featureEvents.filter(e => e.type === 'feature_check').length
    const uniqueUsers = new Set(events.map(e => e.userId).filter(Boolean)).size
    const uniqueSessions = new Set(events.map(e => e.sessionId)).size

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
    const segments = this.calculateSegmentMetrics(events)

    // Calculate time series data
    const timeSeries = this.calculateTimeSeriesData(events)

    // Top alerts
    const topAlerts = this.calculateTopAlerts(alertEvents)

    // Top features
    const topFeatures = this.calculateTopFeatures(featureEvents)

    // Recent events
    const recentEvents = events
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

  private calculateSegmentMetrics(events: AnalyticsEvent[]) {
    const segmentMap = new Map<string, { shows: number, hides: number, checks: number }>()

    events.forEach(event => {
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

    return Array.from(segmentMap.entries()).map(([segment, data]) => {
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
  }

  private calculateTimeSeriesData(events: AnalyticsEvent[]) {
    const dayMap = new Map<string, { shows: number, hides: number, checks: number, users: Set<string> }>()

    events.forEach(event => {
      const day = event.timestamp.split('T')[0]
      const existing = dayMap.get(day) || { shows: 0, hides: 0, checks: 0, users: new Set() }
      
      if (event.type === 'alert_show') existing.shows++
      if (event.type === 'alert_hide') existing.hides++
      if (event.type === 'feature_check') existing.checks++
      if (event.userId) existing.users.add(event.userId)
      
      dayMap.set(day, existing)
    })

    return Array.from(dayMap.entries())
      .map(([timestamp, data]) => ({
        timestamp,
        alertShows: data.shows,
        alertHides: data.hides,
        featureChecks: data.checks,
        uniqueUsers: data.users.size
      }))
      .sort((a, b) => a.timestamp.localeCompare(b.timestamp))
  }

  private calculateTopAlerts(alertEvents: AnalyticsEvent[]) {
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

    return Array.from(alertMap.entries())
      .map(([id, data]) => ({
        id,
        title: data.title,
        shows: data.shows,
        dismissals: data.dismissals,
        dismissalRate: data.shows > 0 ? (data.dismissals / data.shows) * 100 : 0
      }))
      .sort((a, b) => b.shows - a.shows)
      .slice(0, 10)
  }

  private calculateTopFeatures(featureEvents: AnalyticsEvent[]) {
    const featureMap = new Map<string, { checks: number, enabledCount: number }>()

    featureEvents.forEach(event => {
      if (!event.featureName || event.type !== 'feature_check') return
      
      const existing = featureMap.get(event.featureName) || { checks: 0, enabledCount: 0 }
      existing.checks++
      if (event.featureEnabled) existing.enabledCount++
      
      featureMap.set(event.featureName, existing)
    })

    return Array.from(featureMap.entries())
      .map(([name, data]) => ({
        name,
        checks: data.checks,
        enabledCount: data.enabledCount,
        adoptionRate: data.checks > 0 ? (data.enabledCount / data.checks) * 100 : 0
      }))
      .sort((a, b) => b.checks - a.checks)
      .slice(0, 10)
  }

  clearEvents(): void {
    this.events = []
    this.persistEvents()
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService()
export default analyticsService