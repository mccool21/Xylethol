import type { SegmentMetrics } from '../../types/analytics'

interface SegmentTableProps {
  segments: SegmentMetrics[]
  className?: string
}

export default function SegmentTable({ segments, className = '' }: SegmentTableProps) {
  if (!segments || segments.length === 0) {
    return (
      <div className={`bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light ${className}`}>
        <h3 className="text-lg font-semibold text-github-text-primary dark:text-github-dark-text-primary mb-4">
          Segment Performance
        </h3>
        <div className="text-center py-8 text-github-text-secondary dark:text-github-dark-text-secondary">
          No segment data available
        </div>
      </div>
    )
  }

  const getEngagementColor = (rate: number) => {
    if (rate >= 80) return 'text-green-600 dark:text-green-400'
    if (rate >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getSegmentLabel = (segment: string) => {
    const labelMap: Record<string, string> = {
      userType: 'User Type',
      location: 'Location',
      accountAge: 'Account Age',
      activityLevel: 'Activity Level',
      planTier: 'Plan Tier',
      environment: 'Environment'
    }
    return labelMap[segment] || segment
  }

  return (
    <div className={`bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light transition-colors duration-300 ${className}`}>
      <h3 className="text-lg font-semibold text-github-text-primary dark:text-github-dark-text-primary mb-4">
        Segment Performance
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-github-border-light dark:border-github-dark-border-light">
              <th className="text-left py-3 px-2 text-sm font-medium text-github-text-secondary dark:text-github-dark-text-secondary">
                Segment
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-github-text-secondary dark:text-github-dark-text-secondary">
                Value
              </th>
              <th className="text-right py-3 px-2 text-sm font-medium text-github-text-secondary dark:text-github-dark-text-secondary">
                Alert Shows
              </th>
              <th className="text-right py-3 px-2 text-sm font-medium text-github-text-secondary dark:text-github-dark-text-secondary">
                Dismissals
              </th>
              <th className="text-right py-3 px-2 text-sm font-medium text-github-text-secondary dark:text-github-dark-text-secondary">
                Feature Checks
              </th>
              <th className="text-right py-3 px-2 text-sm font-medium text-github-text-secondary dark:text-github-dark-text-secondary">
                Engagement
              </th>
            </tr>
          </thead>
          <tbody>
            {segments.slice(0, 10).map((segment, index) => (
              <tr
                key={`${segment.segment}-${segment.value}`}
                className="border-b border-github-border-light dark:border-github-dark-border-light hover:bg-github-bg-code dark:hover:bg-github-dark-bg-code transition-colors"
              >
                <td className="py-3 px-2">
                  <span className="text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary">
                    {getSegmentLabel(segment.segment)}
                  </span>
                </td>
                <td className="py-3 px-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-github-bg-code dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary border border-github-border-light dark:border-github-dark-border-light">
                    {segment.value}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-sm text-github-text-primary dark:text-github-dark-text-primary font-mono">
                    {segment.alertShows.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-sm text-github-text-primary dark:text-github-dark-text-primary font-mono">
                    {segment.alertHides.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <span className="text-sm text-github-text-primary dark:text-github-dark-text-primary font-mono">
                    {segment.featureChecks.toLocaleString()}
                  </span>
                </td>
                <td className="py-3 px-2 text-right">
                  <div className="flex items-center justify-end">
                    <span className={`text-sm font-medium ${getEngagementColor(segment.engagementRate)}`}>
                      {segment.engagementRate.toFixed(1)}%
                    </span>
                    <div className="ml-2 w-12 bg-github-border dark:bg-github-dark-border rounded-full h-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(segment.engagementRate, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {segments.length > 10 && (
        <div className="mt-4 text-center">
          <span className="text-sm text-github-text-secondary dark:text-github-dark-text-secondary">
            Showing top 10 of {segments.length} segments
          </span>
        </div>
      )}
    </div>
  )
}