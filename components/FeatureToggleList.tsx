interface Segment {
  userType?: string
  location?: string
  accountAge?: string
  activityLevel?: string
  planTier?: string
  targetPage?: string
}

interface FeatureToggle {
  id: string
  name: string
  displayName: string
  description?: string
  isEnabled: boolean
  environment: string
  rolloutPercentage: number
  isActiveFrom: string
  isActiveTo: string
  targetingEnabled?: boolean
  targetSegments?: Segment[]
  createdAt: string
  updatedAt: string
  createdBy?: string
}

interface FeatureToggleListProps {
  featureToggles: FeatureToggle[]
  onEdit: (featureToggle: FeatureToggle) => void
  onDelete: (id: string) => void
  onToggle: (id: string, enabled: boolean) => void
}

const SEGMENT_LABELS = {
  userType: { free: 'Free', trial: 'Trial', premium: 'Premium', enterprise: 'Enterprise' },
  location: { US: 'US', CA: 'Canada', UK: 'UK', EU: 'EU', APAC: 'APAC', OTHER: 'Other' },
  accountAge: { new: 'New', established: 'Established', veteran: 'Veteran' },
  activityLevel: { high: 'High Activity', medium: 'Medium Activity', low: 'Low Activity' },
  planTier: { basic: 'Basic', pro: 'Pro', enterprise: 'Enterprise', custom: 'Custom' },
  targetPage: {}
}

export default function FeatureToggleList({ featureToggles, onEdit, onDelete, onToggle }: FeatureToggleListProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const isCurrentlyActive = (featureToggle: FeatureToggle) => {
    const now = new Date()
    const activeFrom = new Date(featureToggle.isActiveFrom)
    const activeTo = new Date(featureToggle.isActiveTo)
    return featureToggle.isEnabled && now >= activeFrom && now <= activeTo
  }

  const getStatusColor = (featureToggle: FeatureToggle) => {
    if (!featureToggle.isEnabled) return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
    if (!isCurrentlyActive(featureToggle)) return 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
    if (featureToggle.rolloutPercentage < 100) return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
    return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
  }

  const getStatusText = (featureToggle: FeatureToggle) => {
    if (!featureToggle.isEnabled) return 'Disabled'
    if (!isCurrentlyActive(featureToggle)) return 'Scheduled'
    if (featureToggle.rolloutPercentage < 100) return `${featureToggle.rolloutPercentage}% Rollout`
    return 'Active'
  }

  const renderTargetingInfo = (featureToggle: FeatureToggle) => {
    if (!featureToggle.targetingEnabled || !featureToggle.targetSegments || featureToggle.targetSegments.length === 0) {
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
          {featureToggle.targetSegments.map((segment, index) => (
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
      {featureToggles.length === 0 ? (
        <div className="text-center py-8 text-github-text-secondary dark:text-github-dark-text-secondary">
          No feature toggles found. Create your first feature toggle above.
        </div>
      ) : (
        featureToggles.map((featureToggle) => (
          <div
            key={featureToggle.id}
            className={`bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light border-l-4 transition-colors duration-300 ${
              isCurrentlyActive(featureToggle) && featureToggle.rolloutPercentage === 100
                ? 'border-l-green-500'
                : featureToggle.isEnabled && isCurrentlyActive(featureToggle)
                ? 'border-l-blue-500'
                : 'border-l-github-border dark:border-l-github-dark-border'
            }`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold text-github-text-primary dark:text-github-dark-text-primary">
                  {featureToggle.displayName}
                </h3>
                <code className="text-sm text-github-text-secondary dark:text-github-dark-text-secondary bg-github-bg-code dark:bg-github-dark-bg-code px-2 py-1 rounded">
                  {featureToggle.name}
                </code>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(featureToggle)}`}>
                  {getStatusText(featureToggle)}
                </span>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featureToggle.isEnabled}
                    onChange={(e) => onToggle(featureToggle.id, e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    featureToggle.isEnabled ? 'bg-blue-600' : 'bg-github-border dark:bg-github-dark-border'
                  }`}>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        featureToggle.isEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </div>
                </label>
                <button
                  onClick={() => onEdit(featureToggle)}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(featureToggle.id)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>

            {featureToggle.description && (
              <p className="text-github-text-primary dark:text-github-dark-text-primary mb-4">
                {featureToggle.description}
              </p>
            )}

            {/* Feature Details */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
              <div>
                <span className="font-medium text-github-text-primary dark:text-github-dark-text-primary">Environment:</span>
                <div className="text-github-text-secondary dark:text-github-dark-text-secondary">
                  {featureToggle.environment}
                </div>
              </div>
              <div>
                <span className="font-medium text-github-text-primary dark:text-github-dark-text-primary">Rollout:</span>
                <div className="text-github-text-secondary dark:text-github-dark-text-secondary">
                  {featureToggle.rolloutPercentage}%
                </div>
              </div>
              <div>
                <span className="font-medium text-github-text-primary dark:text-github-dark-text-primary">Active From:</span>
                <div className="text-github-text-secondary dark:text-github-dark-text-secondary">
                  {formatDate(featureToggle.isActiveFrom)}
                </div>
              </div>
              <div>
                <span className="font-medium text-github-text-primary dark:text-github-dark-text-primary">Active To:</span>
                <div className="text-github-text-secondary dark:text-github-dark-text-secondary">
                  {formatDate(featureToggle.isActiveTo)}
                </div>
              </div>
            </div>

            {/* Targeting Information */}
            {renderTargetingInfo(featureToggle)}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm text-github-text-secondary dark:text-github-dark-text-secondary">
              <div>
                <strong className="text-github-text-primary dark:text-github-dark-text-primary">Created:</strong> {formatDate(featureToggle.createdAt)}
              </div>
              <div>
                <strong className="text-github-text-primary dark:text-github-dark-text-primary">Updated:</strong> {formatDate(featureToggle.updatedAt)}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}