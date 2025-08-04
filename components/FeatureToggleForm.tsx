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

interface FeatureToggleFormProps {
  onSubmit: (featureToggle: {
    name: string
    displayName: string
    description: string
    isEnabled: boolean
    environment: string
    rolloutPercentage: number
    isActiveFrom: string
    isActiveTo: string
    targetingEnabled: boolean
    targetSegments: Segment[]
  }) => void
  initialData?: {
    name: string
    displayName: string
    description: string
    isEnabled: boolean
    environment?: string
    rolloutPercentage?: number
    isActiveFrom: string
    isActiveTo: string
    targetingEnabled?: boolean
    targetSegments?: Segment[]
  }
}

export default function FeatureToggleForm({ onSubmit, initialData }: FeatureToggleFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [displayName, setDisplayName] = useState(initialData?.displayName || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [isEnabled, setIsEnabled] = useState(initialData?.isEnabled ?? true)
  const [environment, setEnvironment] = useState(initialData?.environment || 'all')
  const [rolloutPercentage, setRolloutPercentage] = useState(initialData?.rolloutPercentage ?? 100)
  const [isActiveFrom, setIsActiveFrom] = useState(
    initialData?.isActiveFrom || new Date().toISOString().slice(0, 16)
  )
  const [isActiveTo, setIsActiveTo] = useState(
    initialData?.isActiveTo || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  )
  const [targetingEnabled, setTargetingEnabled] = useState(
    initialData?.targetingEnabled ?? false
  )
  const [targetSegments, setTargetSegments] = useState<Segment[]>(
    initialData?.targetSegments || []
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      name,
      displayName,
      description,
      isEnabled,
      environment,
      rolloutPercentage,
      isActiveFrom,
      isActiveTo,
      targetingEnabled,
      targetSegments
    })
  }

  const generateNameFromDisplayName = (displayName: string) => {
    return displayName
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '_')
      .trim()
  }

  const handleDisplayNameChange = (value: string) => {
    setDisplayName(value)
    if (!initialData?.name) { // Only auto-generate if not editing existing feature
      setName(generateNameFromDisplayName(value))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light transition-colors duration-300">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
            Display Name *
          </label>
          <input
            type="text"
            id="displayName"
            value={displayName}
            onChange={(e) => handleDisplayNameChange(e.target.value)}
            required
            placeholder="e.g., New Dashboard"
            className="w-full px-3 py-2 border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
        </div>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
            Feature Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="e.g., new_dashboard"
            pattern="[a-z0-9_]+"
            title="Only lowercase letters, numbers, and underscores allowed"
            className="w-full px-3 py-2 border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          />
          <p className="text-xs text-github-text-secondary dark:text-github-dark-text-secondary mt-1">
            Used in code to check feature status. Only lowercase letters, numbers, and underscores.
          </p>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          placeholder="Describe what this feature toggle controls..."
          className="w-full px-3 py-2 border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
        />
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="environment" className="block text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
            Environment
          </label>
          <select
            id="environment"
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="w-full px-3 py-2 border border-github-border dark:border-github-dark-border rounded-md bg-github-bg-secondary dark:bg-github-dark-bg-code text-github-text-primary dark:text-github-dark-text-primary focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
          >
            <option value="all">All Environments</option>
            <option value="development">Development Only</option>
            <option value="staging">Staging Only</option>
            <option value="production">Production Only</option>
          </select>
        </div>

        <div>
          <label htmlFor="rolloutPercentage" className="block text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary mb-1">
            Rollout Percentage
          </label>
          <div className="relative">
            <input
              type="range"
              id="rolloutPercentage"
              min="0"
              max="100"
              step="5"
              value={rolloutPercentage}
              onChange={(e) => setRolloutPercentage(parseInt(e.target.value))}
              className="w-full h-2 bg-github-border dark:bg-github-dark-border rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-github-text-secondary dark:text-github-dark-text-secondary mt-1">
              <span>0%</span>
              <span className="font-medium text-github-text-primary dark:text-github-dark-text-primary">{rolloutPercentage}%</span>
              <span>100%</span>
            </div>
          </div>
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
      </div>

      {/* Time Controls */}
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

      {/* Feature Toggle Preview */}
      <div className="bg-github-bg-code dark:bg-github-dark-bg-code p-4 rounded-lg border border-github-border dark:border-github-dark-border transition-colors duration-300">
        <h4 className="text-sm font-medium text-github-text-primary dark:text-github-dark-text-primary mb-2">Feature Toggle Preview</h4>
        <div className="text-xs text-github-text-secondary dark:text-github-dark-text-secondary space-y-1">
          <div><span className="font-medium">Code Usage:</span> <code className="bg-github-bg-secondary dark:bg-github-dark-bg-secondary px-1 rounded">isFeatureEnabled('{name}')</code></div>
          <div><span className="font-medium">Status:</span> {isEnabled ? '✅ Enabled' : '❌ Disabled'}</div>
          <div><span className="font-medium">Rollout:</span> {rolloutPercentage}% of eligible users</div>
          <div><span className="font-medium">Environment:</span> {environment}</div>
          <div><span className="font-medium">Targeting:</span> {targetingEnabled ? `${targetSegments.length} segment(s)` : 'All users'}</div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 shadow-github hover:shadow-github-hover"
      >
        {initialData ? 'Update Feature Toggle' : 'Create Feature Toggle'}
      </button>
    </form>
  )
}