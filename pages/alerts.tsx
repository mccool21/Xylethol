import { useState, useEffect } from 'react'
import AlertForm from '../components/AlertForm'
import AlertList from '../components/AlertList'

interface Segment {
  userType?: string
  location?: string
  accountAge?: string
  activityLevel?: string
  planTier?: string
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

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/alerts')
      if (response.ok) {
        const alertsData = await response.json()
        setAlerts(alertsData)
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateAlert = async (alertData: {
    title: string
    body: string
    isEnabled: boolean
    isActiveFrom: string
    isActiveTo: string
    targetingEnabled: boolean
    targetSegments: Segment[]
  }) => {
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      })

      if (response.ok) {
        fetchAlerts()
        setShowForm(false)
      }
    } catch (error) {
      console.error('Failed to create alert:', error)
    }
  }

  const handleUpdateAlert = async (alertData: {
    title: string
    body: string
    isEnabled: boolean
    isActiveFrom: string
    isActiveTo: string
    targetingEnabled: boolean
    targetSegments: Segment[]
  }) => {
    if (!editingAlert) return

    try {
      const response = await fetch(`/api/alerts/${editingAlert.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alertData),
      })

      if (response.ok) {
        fetchAlerts()
        setEditingAlert(null)
      }
    } catch (error) {
      console.error('Failed to update alert:', error)
    }
  }

  const handleDeleteAlert = async (id: string) => {
    if (!confirm('Are you sure you want to delete this alert?')) return

    try {
      const response = await fetch(`/api/alerts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchAlerts()
      }
    } catch (error) {
      console.error('Failed to delete alert:', error)
    }
  }

  const handleEdit = (alert: Alert) => {
    setEditingAlert(alert)
    setShowForm(false)
  }

  const handleCancelEdit = () => {
    setEditingAlert(null)
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
          <h1 className="text-3xl font-bold text-github-text-primary dark:text-github-dark-text-primary mb-2">Alert Manager</h1>
          <p className="text-github-text-secondary dark:text-github-dark-text-secondary mb-4">
            Create and manage targeted alerts with user segmentation capabilities.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setShowForm(!showForm)
                setEditingAlert(null)
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 shadow-github hover:shadow-github-hover"
            >
              {showForm ? 'Cancel' : 'Create New Alert'}
            </button>
            {editingAlert && (
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-300 shadow-github hover:shadow-github-hover"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </div>

        {(showForm || editingAlert) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-github-text-primary dark:text-github-dark-text-primary mb-4">
              {editingAlert ? 'Edit Alert' : 'Create New Alert'}
            </h2>
            <AlertForm
              onSubmit={editingAlert ? handleUpdateAlert : handleCreateAlert}
              initialData={editingAlert ? {
                title: editingAlert.title,
                body: editingAlert.body,
                isEnabled: editingAlert.isEnabled,
                isActiveFrom: new Date(editingAlert.isActiveFrom).toISOString().slice(0, 16),
                isActiveTo: new Date(editingAlert.isActiveTo).toISOString().slice(0, 16),
                theme: editingAlert.theme || 'default',
                targetingEnabled: editingAlert.targetingEnabled || false,
                targetSegments: editingAlert.targetSegments || []
              } : undefined}
            />
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-github-text-primary dark:text-github-dark-text-primary mb-4">Alerts</h2>
          <AlertList
            alerts={alerts}
            onEdit={handleEdit}
            onDelete={handleDeleteAlert}
          />
        </div>
      </div>
    </div>
  )
}