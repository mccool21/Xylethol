import { useState } from 'react'
import SegmentationForm from './SegmentationForm'

interface Segment {
  userType?: string
  location?: string
  accountAge?: string
  activityLevel?: string
  planTier?: string
  targetPage?: string
}

interface AlertFormProps {
  onSubmit: (alert: {
    title: string
    body: string
    isEnabled: boolean
    isActiveFrom: string
    isActiveTo: string
    theme: string
    targetingEnabled: boolean
    targetSegments: Segment[]
  }) => void
  initialData?: {
    title: string
    body: string
    isEnabled: boolean
    isActiveFrom: string
    isActiveTo: string
    theme?: string
    targetingEnabled?: boolean
    targetSegments?: Segment[]
  }
}

export default function AlertForm({ onSubmit, initialData }: AlertFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [body, setBody] = useState(initialData?.body || '')
  const [isEnabled, setIsEnabled] = useState(initialData?.isEnabled ?? true)
  const [isActiveFrom, setIsActiveFrom] = useState(
    initialData?.isActiveFrom || new Date().toISOString().slice(0, 16)
  )
  const [isActiveTo, setIsActiveTo] = useState(
    initialData?.isActiveTo || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  )
  const [theme, setTheme] = useState(initialData?.theme || 'default')
  const [targetingEnabled, setTargetingEnabled] = useState(
    initialData?.targetingEnabled ?? false
  )
  const [targetSegments, setTargetSegments] = useState<Segment[]>(
    initialData?.targetSegments || []
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      title,
      body,
      isEnabled,
      isActiveFrom,
      isActiveTo,
      theme,
      targetingEnabled,
      targetSegments
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light transition-colors duration-300">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
        />
      </div>

      <div>
        <label htmlFor="body" className="block text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
          Message Body
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={4}
          className="w-full px-3 py-2 border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
        />
      </div>

      <div>
        <label htmlFor="theme" className="block text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
          Theme
        </label>
        <select
          id="theme"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          className="w-full px-3 py-2 border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
        >
          <option value="default">Default</option>
          <option value="minimal">Minimal</option>
          <option value="modern">Modern</option>
        </select>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="isEnabled"
          checked={isEnabled}
          onChange={(e) => setIsEnabled(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-github-border dark:border-github-dark-border rounded bg-github-bg-secondary dark:bg-github-dark-bg-code"
        />
        <label htmlFor="isEnabled" className="ml-2 block text-sm text-github-text-primary dark:text-github-dark-text-primary">
          Enabled
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="isActiveFrom" className="block text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
            Active From
          </label>
          <input
            type="datetime-local"
            id="isActiveFrom"
            value={isActiveFrom}
            onChange={(e) => setIsActiveFrom(e.target.value)}
            required
            className="w-full px-3 py-2 border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
        </div>

        <div>
          <label htmlFor="isActiveTo" className="block text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
            Active To
          </label>
          <input
            type="datetime-local"
            id="isActiveTo"
            value={isActiveTo}
            onChange={(e) => setIsActiveTo(e.target.value)}
            required
            className="w-full px-3 py-2 border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
        </div>
      </div>

      {/* User Targeting Section */}
      <div>
        <h3 className="text-lg font-medium text-github-text-primary dark:text-github-dark-text-primary mb-2">User Targeting</h3>
        <SegmentationForm
          targetingEnabled={targetingEnabled}
          targetSegments={targetSegments}
          onTargetingChange={setTargetingEnabled}
          onSegmentsChange={setTargetSegments}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 shadow-github hover:shadow-github-hover"
      >
        {initialData ? 'Update Alert' : 'Create Alert'}
      </button>
    </form>
  )
}