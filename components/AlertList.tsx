interface Segment {
  userType?: string
  location?: string
  accountAge?: string
  activityLevel?: string
  planTier?: string
  targetPage?: string
}

interface Alert {
  id: string
  title: string
  body: string
  isEnabled: boolean
  isActiveFrom: string
  isActiveTo: string
  theme?: string
  createdAt: string
  updatedAt: string
  targetingEnabled?: boolean
  targetSegments?: Segment[]
}

interface AlertListProps {
  alerts: Alert[]
  onEdit: (alert: Alert) => void
  onDelete: (id: string) => void
}

const SEGMENT_LABELS = {
  userType: { free: 'Free', trial: 'Trial', premium: 'Premium', enterprise: 'Enterprise' },
  location: { US: 'US', CA: 'Canada', UK: 'UK', EU: 'EU', APAC: 'APAC', OTHER: 'Other' },
  accountAge: { new: 'New', established: 'Established', veteran: 'Veteran' },
  activityLevel: { high: 'High Activity', medium: 'Medium Activity', low: 'Low Activity' },
  planTier: { basic: 'Basic', pro: 'Pro', enterprise: 'Enterprise', custom: 'Custom' },
  targetPage: {} // Dynamic - will show the actual page path
}

export default function AlertList({ alerts, onEdit, onDelete }: AlertListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const isCurrentlyActive = (alert: Alert) => {
    const now = new Date()
    const activeFrom = new Date(alert.isActiveFrom)
    const activeTo = new Date(alert.isActiveTo)
    return alert.isEnabled && now >= activeFrom && now <= activeTo
  }

  const renderTargetingInfo = (alert: Alert) => {
    if (!alert.targetingEnabled || !alert.targetSegments || alert.targetSegments.length === 0) {
      return (
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-github-bg-code dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary border border-github-border-light dark:border-github-dark-border-light">
            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            All Users
          </span>
        </div>
      )
    }

    return (
      <div className="mt-2">
        <div className="flex items-center mb-2">
          <svg className="w-4 h-4 text-blue-600 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary">Targeted Segments:</span>
        </div>
        <div className="space-y-1">
          {alert.targetSegments.map((segment, index) => (
            <div key={index} className="text-xs">
              <span className="inline-flex items-center px-2 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                Segment {index + 1}: {
                  Object.entries(segment)
                    .filter(([_, value]) => value)
                    .map(([key, value]) => {
                      if (key === 'targetPage') {
                        return `Page: ${value}`;
                      }
                      const label = SEGMENT_LABELS[key as keyof typeof SEGMENT_LABELS]?.[value as keyof typeof SEGMENT_LABELS[keyof typeof SEGMENT_LABELS]] || value;
                      return label;
                    })
                    .join(', ') || 'Any User'
                }
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="text-center py-8 text-github-text-secondary dark:text-github-dark-text-secondary">
          No alerts found. Create your first alert above.
        </div>
      ) : (
        alerts.map((alert) => (
          <div
            key={alert.id}
            className={`bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light border-l-4 transition-colors duration-300 ${
              isCurrentlyActive(alert) ? 'border-l-green-500' : 'border-l-github-border dark:border-l-github-dark-border'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-github-text-primary dark:text-github-dark-text-primary">{alert.title}</h3>
              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    isCurrentlyActive(alert)
                      ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                      : alert.isEnabled
                      ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                      : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  }`}
                >
                  {isCurrentlyActive(alert) ? 'Active' : alert.isEnabled ? 'Scheduled' : 'Disabled'}
                </span>
                <button
                  onClick={() => onEdit(alert)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(alert.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="text-github-text-primary dark:text-github-dark-text-primary mb-4">{alert.body}</p>

            {/* Targeting Information */}
            {renderTargetingInfo(alert)}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-github-text-secondary dark:text-github-dark-text-secondary">
              <div>
                <strong className="text-github-text-primary dark:text-github-dark-text-primary">Active From:</strong> {formatDate(alert.isActiveFrom)}
              </div>
              <div>
                <strong className="text-github-text-primary dark:text-github-dark-text-primary">Active To:</strong> {formatDate(alert.isActiveTo)}
              </div>
              <div>
                <strong className="text-github-text-primary dark:text-github-dark-text-primary">Created:</strong> {formatDate(alert.createdAt)}
              </div>
              <div>
                <strong className="text-github-text-primary dark:text-github-dark-text-primary">Updated:</strong> {formatDate(alert.updatedAt)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}