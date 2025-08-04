import { useState } from 'react'

interface DataPoint {
  label: string
  value: number
  color?: string
}

interface SimpleChartProps {
  data: DataPoint[]
  type: 'line' | 'bar' | 'area'
  title: string
  height?: number
  showValues?: boolean
  className?: string
}

export default function SimpleChart({ 
  data, 
  type, 
  title, 
  height = 200, 
  showValues = false,
  className = '' 
}: SimpleChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!data || data.length === 0) {
    return (
      <div className={`bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light ${className}`}>
        <h3 className="text-lg font-semibold text-github-text-primary dark:text-github-dark-text-primary mb-4">
          {title}
        </h3>
        <div className="flex items-center justify-center h-40 text-github-text-secondary dark:text-github-dark-text-secondary">
          No data available
        </div>
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  const getHeight = (value: number) => {
    return ((value - minValue) / range) * (height - 40) + 20
  }

  const renderLineChart = () => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (getHeight(point.value) / height) * 100
      return `${x},${y}`
    }).join(' ')

    return (
      <svg viewBox="0 0 100 100" className="w-full" style={{ height: `${height}px` }}>
        <polyline
          fill="none"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
          points={points}
          className="transition-all duration-300"
        />
        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * 100
          const y = 100 - (getHeight(point.value) / height) * 100
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="rgb(59, 130, 246)"
              className="cursor-pointer hover:r-4 transition-all"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          )
        })}
      </svg>
    )
  }

  const renderBarChart = () => {
    const barWidth = 80 / data.length
    
    return (
      <div className="flex items-end justify-between h-full pt-4">
        {data.map((point, index) => {
          const barHeight = (getHeight(point.value) / height) * 100
          return (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ width: `${barWidth}%` }}
            >
              <div
                className="bg-blue-600 dark:bg-blue-500 transition-all duration-300 group-hover:bg-blue-700 dark:group-hover:bg-blue-400"
                style={{ 
                  height: `${barHeight}%`,
                  minHeight: '2px',
                  width: '80%'
                }}
              />
              {showValues && (
                <span className="text-xs text-github-text-secondary dark:text-github-dark-text-secondary mt-1 text-center">
                  {point.value}
                </span>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const renderAreaChart = () => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * 100
      const y = 100 - (getHeight(point.value) / height) * 100
      return { x, y }
    })

    const pathData = `M ${points[0].x} ${points[0].y} ` +
      points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ') +
      ` L 100 100 L 0 100 Z`

    return (
      <svg viewBox="0 0 100 100" className="w-full" style={{ height: `${height}px` }}>
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path
          d={pathData}
          fill="url(#areaGradient)"
          stroke="rgb(59, 130, 246)"
          strokeWidth="2"
          className="transition-all duration-300"
        />
      </svg>
    )
  }

  return (
    <div className={`bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light transition-colors duration-300 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-github-text-primary dark:text-github-dark-text-primary">
          {title}
        </h3>
        {hoveredIndex !== null && (
          <div className="text-sm bg-github-bg-code dark:bg-github-dark-bg-code px-2 py-1 rounded border border-github-border dark:border-github-dark-border">
            <span className="text-github-text-secondary dark:text-github-dark-text-secondary">
              {data[hoveredIndex].label}:
            </span>
            <span className="text-github-text-primary dark:text-github-dark-text-primary ml-1 font-medium">
              {data[hoveredIndex].value}
            </span>
          </div>
        )}
      </div>
      
      <div style={{ height: `${height}px` }}>
        {type === 'line' && renderLineChart()}
        {type === 'bar' && renderBarChart()}
        {type === 'area' && renderAreaChart()}
      </div>

      {/* X-axis labels */}
      <div className="flex justify-between mt-2 text-xs text-github-text-secondary dark:text-github-dark-text-secondary">
        {data.map((point, index) => (
          <span key={index} className="text-center" style={{ width: `${100 / data.length}%` }}>
            {point.label}
          </span>
        ))}
      </div>
    </div>
  )
}