import type { AnalyticsEvent } from '../../types/analytics'

interface RecentEventsProps {
  events: AnalyticsEvent[]
  className?: string
}

export default function RecentEvents({ events, className = '' }: RecentEventsProps) {
  if (!events || events.length === 0) {
    return (
      <div className={`bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light ${className}`}>
        <h3 className="text-lg font-semibold text-github-text-primary dark:text-github-dark-text-primary mb-4">
          Recent Events
        </h3>
        <div className="text-center py-8 text-github-text-secondary dark:text-github-dark-text-secondary">
          No recent events
        </div>
      </div>
    )
  }

  const getEventIcon = (type: string) => {
    const icons = {
      alert_show: '👁️',
      alert_hide: '❌',
      alert_error: '⚠️',
      feature_check: '🔍',
      feature_change: '🔄',
      feature_error: '💥'
    }
    return icons[type as keyof typeof icons] || '📊'
  }

  const getEventColor = (type: string) => {
    const colors = {
      alert_show: 'text-blue-600 dark:text-blue-400',
      alert_hide: 'text-gray-600 dark:text-gray-400',
      alert_error: 'text-red-600 dark:text-red-400',
      feature_check: 'text-green-600 dark:text-green-400',
      feature_change: 'text-purple-600 dark:text-purple-400',
      feature_error: 'text-red-600 dark:text-red-400'
    }
    return colors[type as keyof typeof colors] || 'text-github-text-primary dark:text-github-dark-text-primary'
  }

  const getEventDescription = (event: AnalyticsEvent) => {
    switch (event.type) {
      case 'alert_show':
        return `Alert "${event.alertTitle || 'Unknown'}" shown`
      case 'alert_hide':
        return `Alert dismissed`
      case 'alert_error':
        return `Alert error: ${event.metadata?.error || 'Unknown error'}`
      case 'feature_check':
        return `Feature "${event.featureName}" checked (${event.featureEnabled ? 'enabled' : 'disabled'})`
      case 'feature_change':
        return `Feature "${event.featureName}" ${event.featureEnabled ? 'enabled' : 'disabled'}`
      case 'feature_error':
        return `Feature error: ${event.metadata?.error || 'Unknown error'}`
      default:
        return 'Unknown event'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getUserContext = (event: AnalyticsEvent) => {
    const attributes = event.userAttributes
    if (!attributes) return null

    const contextItems = []
    if (attributes.userType) contextItems.push(`${attributes.userType} user`)
    if (attributes.location) contextItems.push(attributes.location)
    if (attributes.planTier) contextItems.push(attributes.planTier)
    if (attributes.currentPage) contextItems.push(`on ${attributes.currentPage}`)

    return contextItems.length > 0 ? contextItems.join(', ') : null
  }

  return (
    <div className={`bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light transition-colors duration-300 ${className}`}>
      <h3 className="text-lg font-semibold text-github-text-primary dark:text-github-dark-text-primary mb-4">
        Recent Events
      </h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {events.slice(0, 50).map((event) => (
          <div
            key={event.id}
            className="flex items-start space-x-3 p-3 rounded-md hover:bg-github-bg-code dark:hover:bg-github-dark-bg-code transition-colors"
          >
            <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
              <span className="text-sm">{getEventIcon(event.type)}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${getEventColor(event.type)}`}>
                  {getEventDescription(event)}
                </p>
                <span className="text-xs text-github-text-secondary dark:text-github-dark-text-secondary flex-shrink-0 ml-2">
                  {formatTime(event.timestamp)}
                </span>
              </div>
              
              {getUserContext(event) && (
                <p className="text-xs text-github-text-secondary dark:text-github-dark-text-secondary mt-1">
                  {getUserContext(event)}
                </p>
              )}
              
              {event.userId && (
                <p className="text-xs text-github-text-secondary dark:text-github-dark-text-secondary mt-1">
                  User: {event.userId}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {events.length > 50 && (
        <div className="mt-4 text-center border-t border-github-border-light dark:border-github-dark-border-light pt-3">
          <span className="text-sm text-github-text-secondary dark:text-github-dark-text-secondary">
            Showing latest 50 of {events.length} events
          </span>
        </div>
      )}
    </div>
  )
}