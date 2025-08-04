import { useState, useEffect } from 'react'
import FeatureToggleForm from '../components/FeatureToggleForm'
import FeatureToggleList from '../components/FeatureToggleList'

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

export default function FeaturesPage() {
  const [featureToggles, setFeatureToggles] = useState<FeatureToggle[]>([])
  const [editingFeature, setEditingFeature] = useState<FeatureToggle | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchFeatureToggles()
  }, [])

  const fetchFeatureToggles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/features')
      if (response.ok) {
        const data = await response.json()
        setFeatureToggles(data)
      } else {
        console.error('Failed to fetch feature toggles')
      }
    } catch (error) {
      console.error('Error fetching feature toggles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (featureToggleData: any) => {
    try {
      setSubmitting(true)
      const url = editingFeature ? `/api/features/${editingFeature.id}` : '/api/features'
      const method = editingFeature ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(featureToggleData),
      })

      if (response.ok) {
        await fetchFeatureToggles()
        setEditingFeature(null)
        setShowForm(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save feature toggle')
      }
    } catch (error) {
      console.error('Error saving feature toggle:', error)
      alert('Failed to save feature toggle')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (featureToggle: FeatureToggle) => {
    setEditingFeature(featureToggle)
    setShowForm(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature toggle?')) return

    try {
      const response = await fetch(`/api/features/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchFeatureToggles()
      } else {
        alert('Failed to delete feature toggle')
      }
    } catch (error) {
      console.error('Error deleting feature toggle:', error)
      alert('Failed to delete feature toggle')
    }
  }

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      const featureToggle = featureToggles.find(f => f.id === id)
      if (!featureToggle) return

      const response = await fetch(`/api/features/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...featureToggle,
          isEnabled: enabled,
        }),
      })

      if (response.ok) {
        await fetchFeatureToggles()
      } else {
        alert('Failed to toggle feature')
      }
    } catch (error) {
      console.error('Error toggling feature:', error)
      alert('Failed to toggle feature')
    }
  }

  const handleCancelEdit = () => {
    setEditingFeature(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-github-bg-primary dark:bg-github-dark-bg-primary flex items-center justify-center transition-colors duration-300">
        <div className="text-github-text-secondary dark:text-github-dark-text-secondary">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-github-bg-primary dark:bg-github-dark-bg-primary py-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-github-text-primary dark:text-github-dark-text-primary mb-2">Feature Toggles</h1>
          <p className="text-github-text-secondary dark:text-github-dark-text-secondary mb-4">
            Manage feature flags and control functionality rollouts with user targeting.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setShowForm(!showForm)
                setEditingFeature(null)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 shadow-github hover:shadow-github-hover"
            >
              {showForm ? 'Cancel' : 'Create New Feature Toggle'}
            </button>
            {editingFeature && (
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-300 shadow-github hover:shadow-github-hover"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {(showForm || editingFeature) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-github-text-primary dark:text-github-dark-text-primary mb-4">
              {editingFeature ? 'Edit Feature Toggle' : 'Create New Feature Toggle'}
            </h2>
            <FeatureToggleForm
              onSubmit={handleSubmit}
              initialData={editingFeature ? {
                name: editingFeature.name,
                displayName: editingFeature.displayName,
                description: editingFeature.description || '',
                isEnabled: editingFeature.isEnabled,
                environment: editingFeature.environment,
                rolloutPercentage: editingFeature.rolloutPercentage,
                isActiveFrom: editingFeature.isActiveFrom,
                isActiveTo: editingFeature.isActiveTo,
                targetingEnabled: editingFeature.targetingEnabled,
                targetSegments: editingFeature.targetSegments,
              } : undefined}
            />
            {submitting && (
              <div className="mt-4 text-center text-github-text-secondary dark:text-github-dark-text-secondary">
                Saving feature toggle...
              </div>
            )}
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-github-text-primary dark:text-github-dark-text-primary mb-4">Feature Toggles</h2>
          <FeatureToggleList
            featureToggles={featureToggles}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        </div>

        {/* Usage Instructions */}
        <div className="mt-12 bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg border border-github-border-light dark:border-github-dark-border-light">
          <h3 className="text-lg font-semibold text-github-text-primary dark:text-github-dark-text-primary mb-3">
            How to Use Feature Toggles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-github-text-primary dark:text-github-dark-text-primary mb-2">Client-Side Usage</h4>
              <pre className="bg-github-bg-code dark:bg-github-dark-bg-code p-3 rounded text-github-text-primary dark:text-github-dark-text-primary overflow-x-auto">
{`// Check if feature is enabled
const isEnabled = await FeatureToggle.check('new_dashboard', {
  userType: 'premium',
  location: 'US'
});

if (isEnabled) {
  // Show new feature
}`}</pre>
            </div>
            <div>
              <h4 className="font-medium text-github-text-primary dark:text-github-dark-text-primary mb-2">React Hook Usage</h4>
              <pre className="bg-github-bg-code dark:bg-github-dark-bg-code p-3 rounded text-github-text-primary dark:text-github-dark-text-primary overflow-x-auto">
{`// React component
const { isEnabled } = useFeatureToggle('new_dashboard');

return (
  <div>
    {isEnabled && <NewDashboard />}
  </div>
);`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}