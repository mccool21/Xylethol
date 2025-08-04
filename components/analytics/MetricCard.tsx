interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
  className?: string
}

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  icon, 
  className = '' 
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`
      if (val % 1 !== 0) return val.toFixed(1)
      return val.toString()
    }
    return val
  }

  return (
    <div className={`bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light transition-colors duration-300 ${className}`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-github-text-secondary dark:text-github-dark-text-secondary mb-1">
            {title}
          </h3>
          <p className="text-2xl font-bold text-github-text-primary dark:text-github-dark-text-primary">
            {formatValue(value)}
          </p>
          {subtitle && (
            <p className="text-xs text-github-text-secondary dark:text-github-dark-text-secondary mt-1">
              {subtitle}
            </p>
          )}
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium ${
                trend.isPositive 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
              </span>
              <span className="text-xs text-github-text-secondary dark:text-github-dark-text-secondary ml-1">
                vs last period
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="text-github-text-secondary dark:text-github-dark-text-secondary">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}