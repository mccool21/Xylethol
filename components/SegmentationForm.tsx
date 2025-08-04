import { useState } from 'react'

interface Segment {
  userType?: string
  location?: string
  accountAge?: string
  activityLevel?: string
  planTier?: string
  targetPage?: string
}

interface SegmentationFormProps {
  targetingEnabled: boolean
  targetSegments: Segment[]
  onTargetingChange: (enabled: boolean) => void
  onSegmentsChange: (segments: Segment[]) => void
}

const SEGMENT_OPTIONS = {
  userType: [
    { value: 'free', label: 'Free Users' },
    { value: 'trial', label: 'Trial Users' },
    { value: 'premium', label: 'Premium Users' },
    { value: 'enterprise', label: 'Enterprise Users' }
  ],
  location: [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'EU', label: 'European Union' },
    { value: 'APAC', label: 'Asia Pacific' },
    { value: 'OTHER', label: 'Other Regions' }
  ],
  accountAge: [
    { value: 'new', label: 'New (0-30 days)' },
    { value: 'established', label: 'Established (31-365 days)' },
    { value: 'veteran', label: 'Veteran (365+ days)' }
  ],
  activityLevel: [
    { value: 'high', label: 'High Activity' },
    { value: 'medium', label: 'Medium Activity' },
    { value: 'low', label: 'Low Activity' }
  ],
  planTier: [
    { value: 'basic', label: 'Basic Plan' },
    { value: 'pro', label: 'Pro Plan' },
    { value: 'enterprise', label: 'Enterprise Plan' },
    { value: 'custom', label: 'Custom Plan' }
  ]
}

export default function SegmentationForm({
  targetingEnabled,
  targetSegments,
  onTargetingChange,
  onSegmentsChange
}: SegmentationFormProps) {
  const [segments, setSegments] = useState<Segment[]>(
    targetSegments.length > 0 ? targetSegments : [{}]
  )

  const handleTargetingToggle = (enabled: boolean) => {
    onTargetingChange(enabled)
    if (!enabled) {
      setSegments([{}])
      onSegmentsChange([])
    }
  }

  const handleSegmentChange = (index: number, field: keyof Segment, value: string) => {
    const newSegments = [...segments]
    if (value === '') {
      delete newSegments[index][field]
    } else {
      newSegments[index] = { ...newSegments[index], [field]: value }
    }
    setSegments(newSegments)
    onSegmentsChange(newSegments.filter(seg => Object.keys(seg).length > 0))
  }

  const addSegment = () => {
    const newSegments = [...segments, {}]
    setSegments(newSegments)
  }

  const removeSegment = (index: number) => {
    if (segments.length > 1) {
      const newSegments = segments.filter((_, i) => i !== index)
      setSegments(newSegments)
      onSegmentsChange(newSegments.filter(seg => Object.keys(seg).length > 0))
    }
  }

  return (
    <div className="bg-github-bg-code dark:bg-github-dark-bg-code p-4 rounded-lg border border-github-border dark:border-github-dark-border transition-colors duration-300">
      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="targetingEnabled"
          checked={targetingEnabled}
          onChange={(e) => handleTargetingToggle(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-github-border dark:border-github-dark-border rounded bg-github-bg-secondary dark:bg-github-dark-bg-secondary"
        />
        <label htmlFor="targetingEnabled" className="ml-2 block text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary">
          Enable User Targeting
        </label>
      </div>

      {targetingEnabled && (
        <div className="space-y-4">
          <p className="text-sm text-github-text-secondary dark:text-github-dark-text-secondary mb-4">
            Define user segments to target with this alert. Users matching ANY of the segments below will see the alert.
          </p>

          {segments.map((segment, segmentIndex) => (
            <div key={segmentIndex} className="bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-4 rounded border border-github-border dark:border-github-dark-border transition-colors duration-300">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary">
                  Segment {segmentIndex + 1}
                </h4>
                {segments.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSegment(segmentIndex)}
                    className="text-red-600 hover:text-red-800 text-sm transition-colors duration-300"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* User Type */}
                <div>
                  <label className="block text-xs font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
                    User Type
                  </label>
                  <select
                    value={segment.userType || ''}
                    onChange={(e) => handleSegmentChange(segmentIndex, 'userType', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
                  >
                    <option value="">Any Type</option>
                    {SEGMENT_OPTIONS.userType.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
                    Location
                  </label>
                  <select
                    value={segment.location || ''}
                    onChange={(e) => handleSegmentChange(segmentIndex, 'location', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
                  >
                    <option value="">Any Location</option>
                    {SEGMENT_OPTIONS.location.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Account Age */}
                <div>
                  <label className="block text-xs font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
                    Account Age
                  </label>
                  <select
                    value={segment.accountAge || ''}
                    onChange={(e) => handleSegmentChange(segmentIndex, 'accountAge', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
                  >
                    <option value="">Any Age</option>
                    {SEGMENT_OPTIONS.accountAge.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Activity Level */}
                <div>
                  <label className="block text-xs font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
                    Activity Level
                  </label>
                  <select
                    value={segment.activityLevel || ''}
                    onChange={(e) => handleSegmentChange(segmentIndex, 'activityLevel', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
                  >
                    <option value="">Any Activity</option>
                    {SEGMENT_OPTIONS.activityLevel.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Plan Tier */}
                <div>
                  <label className="block text-xs font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
                    Plan Tier
                  </label>
                  <select
                    value={segment.planTier || ''}
                    onChange={(e) => handleSegmentChange(segmentIndex, 'planTier', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
                  >
                    <option value="">Any Plan</option>
                    {SEGMENT_OPTIONS.planTier.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Page */}
                <div>
                  <label className="block text-xs font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
                    Target Page
                  </label>
                  <input
                    type="text"
                    value={segment.targetPage || ''}
                    onChange={(e) => handleSegmentChange(segmentIndex, 'targetPage', e.target.value)}
                    placeholder="e.g., /dashboard, /pricing (leave empty for all pages)"
                    className="w-full px-3 py-2 text-sm border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Segment Preview */}
              <div className="mt-3 p-2 bg-github-bg-code dark:bg-github-dark-bg-code rounded text-xs text-github-text-secondary dark:text-github-dark-text-secondary transition-colors duration-300">
                <strong>Target:</strong> {
                  Object.keys(segment).length === 0 
                    ? 'All users' 
                    : Object.entries(segment)
                        .filter(([_, value]) => value)
                        .map(([key, value]) => {
                          if (key === 'targetPage') {
                            return `Page: ${value}`;
                          }
                          const option = SEGMENT_OPTIONS[key as keyof typeof SEGMENT_OPTIONS]
                            ?.find(opt => opt.value === value);
                          return option?.label || value;
                        })
                        .join(', ')
                }
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addSegment}
            className="flex items-center px-3 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors duration-300"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Another Segment
          </button>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-md transition-colors duration-300">
            <div className="flex">
              <svg className="w-5 h-5 text-blue-400 dark:text-blue-300 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">How Targeting Works</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Users will see this alert if they match <strong>ANY</strong> of the segments defined above. 
                  Within each segment, users must match <strong>ALL</strong> the selected criteria.
                  If no targeting is enabled, all users will see the alert.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}