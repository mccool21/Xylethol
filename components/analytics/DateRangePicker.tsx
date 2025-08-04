import { useState } from 'react'
import type { DateRange } from '../../types/analytics'

interface DateRangePickerProps {
  dateRange: DateRange
  onChange: (range: DateRange) => void
  className?: string
}

export default function DateRangePicker({ dateRange, onChange, className = '' }: DateRangePickerProps) {
  const [isCustom, setIsCustom] = useState(false)

  const presets = [
    { label: 'Last 24 hours', days: 1 },
    { label: 'Last 7 days', days: 7 },
    { label: 'Last 30 days', days: 30 },
    { label: 'Last 90 days', days: 90 }
  ]

  const formatDateForInput = (date: Date) => {
    return date.toISOString().slice(0, 16)
  }

  const handlePresetClick = (days: number) => {
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - days)
    
    onChange({ start, end })
    setIsCustom(false)
  }

  const handleCustomDateChange = (type: 'start' | 'end', value: string) => {
    const newDate = new Date(value)
    if (type === 'start') {
      onChange({ start: newDate, end: dateRange.end })
    } else {
      onChange({ start: dateRange.start, end: newDate })
    }
  }

  return (
    <div className={`bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-4 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light transition-colors duration-300 ${className}`}>
      <h4 className="text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary mb-3">
        Date Range
      </h4>
      
      {/* Preset buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {presets.map((preset) => (
          <button
            key={preset.days}
            onClick={() => handlePresetClick(preset.days)}
            className="px-3 py-2 text-xs font-medium text-github-text-primary dark:text-github-dark-text-primary bg-github-bg-code dark:bg-github-dark-bg-code hover:bg-github-border dark:hover:bg-github-dark-border border border-github-border-light dark:border-github-dark-border-light rounded-md transition-colors"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Custom date toggle */}
      <div className="mb-3">
        <button
          onClick={() => setIsCustom(!isCustom)}
          className="flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
        >
          <span className="mr-1">{isCustom ? '▼' : '▶'}</span>
          Custom Range
        </button>
      </div>

      {/* Custom date inputs */}
      {isCustom && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-github-text-secondary dark:text-github-dark-text-secondary mb-1">
              Start Date
            </label>
            <input
              type="datetime-local"
              value={formatDateForInput(dateRange.start)}
              onChange={(e) => handleCustomDateChange('start', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-code dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-github-text-secondary dark:text-github-dark-text-secondary mb-1">
              End Date
            </label>
            <input
              type="datetime-local"
              value={formatDateForInput(dateRange.end)}
              onChange={(e) => handleCustomDateChange('end', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-code dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>
      )}

      {/* Current range display */}
      <div className="mt-4 pt-3 border-t border-github-border-light dark:border-github-dark-border-light">
        <div className="text-xs text-github-text-secondary dark:text-github-dark-text-secondary">
          <div>From: {dateRange.start.toLocaleString()}</div>
          <div>To: {dateRange.end.toLocaleString()}</div>
        </div>
      </div>
    </div>
  )
}