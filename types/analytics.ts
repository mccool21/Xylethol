export interface AnalyticsEvent {
  id: string
  type: 'alert_show' | 'alert_hide' | 'alert_error' | 'feature_check' | 'feature_change' | 'feature_error'
  timestamp: string
  userId?: string
  sessionId?: string
  
  // Alert-specific data
  alertId?: string
  alertTitle?: string
  alertTheme?: string
  
  // Feature-specific data
  featureName?: string
  featureEnabled?: boolean
  rolloutPercentage?: number
  
  // User context
  userAttributes?: {
    userType?: string
    location?: string
    accountAge?: string
    activityLevel?: string
    planTier?: string
    currentPage?: string
    environment?: string
  }
  
  // Additional metadata
  metadata?: Record<string, any>
}

export interface AnalyticsMetrics {
  // Alert metrics
  totalAlerts: number
  alertShows: number
  alertHides: number
  alertDismissalRate: number
  avgTimeToClose?: number
  
  // Feature metrics
  totalFeatureChecks: number
  activeFeatures: number
  featureAdoptionRate: number
  
  // User engagement
  uniqueUsers: number
  sessionCount: number
  
  // Time-based data
  dateRange: {
    start: string
    end: string
  }
}

export interface SegmentMetrics {
  segment: string
  value: string
  alertShows: number
  alertHides: number
  featureChecks: number
  engagementRate: number
  conversionRate?: number
}

export interface TimeSeriesData {
  timestamp: string
  alertShows: number
  alertHides: number
  featureChecks: number
  uniqueUsers: number
}

export interface DashboardData {
  overview: AnalyticsMetrics
  segments: SegmentMetrics[]
  timeSeries: TimeSeriesData[]
  topAlerts: Array<{
    id: string
    title: string
    shows: number
    dismissals: number
    dismissalRate: number
  }>
  topFeatures: Array<{
    name: string
    checks: number
    enabledCount: number
    adoptionRate: number
  }>
  recentEvents: AnalyticsEvent[]
}

export interface DateRange {
  start: Date
  end: Date
}

export interface DashboardFilters {
  dateRange: DateRange
  userSegments?: string[]
  alertIds?: string[]
  featureNames?: string[]
  environment?: string
}