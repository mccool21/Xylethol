import { useState, useEffect } from 'react'
import Head from 'next/head'
import type { DashboardData, DateRange, DashboardFilters } from '../types/analytics'
import MetricCard from '../components/analytics/MetricCard'
import SimpleChart from '../components/analytics/SimpleChart'
import SegmentTable from '../components/analytics/SegmentTable'
import RecentEvents from '../components/analytics/RecentEvents'
import DateRangePicker from '../components/analytics/DateRangePicker'
import { useAnalytics, initializeAnalyticsEnhancements } from '../hooks/useAnalytics'

export default function AnalyticsPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAllEvents, setShowAllEvents] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    end: new Date(Date.now() + 5 * 60 * 1000) // Add 5 minutes buffer for recent events
  })

  const { analyticsService } = useAnalytics({ enabled: true })

  useEffect(() => {
    // Initialize analytics enhancements for widgets
    initializeAnalyticsEnhancements()
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [dateRange, showAllEvents])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const filters: Partial<DashboardFilters> = showAllEvents ? {} : {
        dateRange
      }
      
      console.log('📊 Dashboard sending filters:', filters)

      const response = await fetch('/api/analytics/dashboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(filters)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data: DashboardData = await response.json()
      console.log('📊 Dashboard received data:', data)
      setDashboardData(data)
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      
      // Fallback to local data if API fails
      try {
        const localData = await analyticsService.getDashboardData({ dateRange })
        setDashboardData(localData)
        setError('Using local data (API unavailable)')
      } catch (localErr) {
        setError('Failed to load analytics data')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    fetchDashboardData()
  }

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-github-bg-primary dark:bg-github-dark-bg-primary transition-colors duration-300">
        <Head>
          <title>Analytics Dashboard - Windingo</title>
        </Head>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-github-text-secondary dark:text-github-dark-text-secondary">
                Loading analytics data...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-github-bg-primary dark:bg-github-dark-bg-primary transition-colors duration-300">
      <Head>
        <title>Analytics Dashboard - Windingo</title>
        <meta name="description" content="Analytics dashboard for user alerts and feature toggles" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-github-text-primary dark:text-github-dark-text-primary">
              Analytics Dashboard
            </h1>
            <p className="text-github-text-secondary dark:text-github-dark-text-secondary mt-2">
              Monitor user engagement with alerts and feature toggles
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showAllEvents}
                onChange={(e) => setShowAllEvents(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-github-text-secondary dark:text-github-dark-text-secondary">
                Show All Events (Debug)
              </span>
            </label>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm">
              ⚠️ {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Date Range Filter */}
          <div className="lg:col-span-1">
            <DateRangePicker
              dateRange={dateRange}
              onChange={setDateRange}
            />
          </div>

          {/* Overview Metrics */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Alerts"
                value={dashboardData?.overview.totalAlerts || 0}
                subtitle="Active alerts"
                icon={<span className="text-2xl">📢</span>}
              />
              <MetricCard
                title="Alert Shows"
                value={dashboardData?.overview.alertShows || 0}
                subtitle="Times shown"
                icon={<span className="text-2xl">👁️</span>}
              />
              <MetricCard
                title="Dismissal Rate"
                value={`${(dashboardData?.overview.alertDismissalRate || 0).toFixed(1)}%`}
                subtitle="Alerts dismissed"
                icon={<span className="text-2xl">❌</span>}
              />
              <MetricCard
                title="Unique Users"
                value={dashboardData?.overview.uniqueUsers || 0}
                subtitle="Active users"
                icon={<span className="text-2xl">👥</span>}
              />
              <MetricCard
                title="Feature Checks"
                value={dashboardData?.overview.totalFeatureChecks || 0}
                subtitle="API calls"
                icon={<span className="text-2xl">🔍</span>}
              />
              <MetricCard
                title="Active Features"
                value={dashboardData?.overview.activeFeatures || 0}
                subtitle="Features in use"
                icon={<span className="text-2xl">🎛️</span>}
              />
              <MetricCard
                title="Adoption Rate"
                value={`${(dashboardData?.overview.featureAdoptionRate || 0).toFixed(1)}%`}
                subtitle="Features enabled"
                icon={<span className="text-2xl">📈</span>}
              />
              <MetricCard
                title="Sessions"
                value={dashboardData?.overview.sessionCount || 0}
                subtitle="User sessions"
                icon={<span className="text-2xl">💻</span>}
              />
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SimpleChart
            title="Activity Over Time"
            type="area"
            data={(dashboardData?.timeSeries || []).map(point => ({
              label: new Date(point.timestamp).toLocaleDateString(),
              value: point.alertShows + point.featureChecks
            }))}
          />
          <SimpleChart
            title="Daily Unique Users"
            type="line"
            data={(dashboardData?.timeSeries || []).map(point => ({
              label: new Date(point.timestamp).toLocaleDateString(),
              value: point.uniqueUsers
            }))}
          />
        </div>

        {/* Top Performers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Alerts */}
          <div className="bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light transition-colors duration-300">
            <h3 className="text-lg font-semibold text-github-text-primary dark:text-github-dark-text-primary mb-4">
              Top Performing Alerts
            </h3>
            {dashboardData?.topAlerts && dashboardData.topAlerts.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.topAlerts.slice(0, 5).map((alert, index) => (
                  <div
                    key={alert.id}
                    className="flex justify-between items-center p-3 bg-github-bg-code dark:bg-github-dark-bg-code rounded border border-github-border-light dark:border-github-dark-border-light"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-github-text-primary dark:text-github-dark-text-primary text-sm">
                        {alert.title}
                      </h4>
                      <p className="text-xs text-github-text-secondary dark:text-github-dark-text-secondary">
                        {alert.shows} shows • {alert.dismissalRate.toFixed(1)}% dismissed
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono text-github-text-primary dark:text-github-dark-text-primary">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-github-text-secondary dark:text-github-dark-text-secondary py-8">
                No alert data available
              </p>
            )}
          </div>

          {/* Top Features */}
          <div className="bg-github-bg-secondary dark:bg-github-dark-bg-secondary p-6 rounded-lg shadow-github dark:shadow-github-dark border border-github-border-light dark:border-github-dark-border-light transition-colors duration-300">
            <h3 className="text-lg font-semibold text-github-text-primary dark:text-github-dark-text-primary mb-4">
              Most Checked Features
            </h3>
            {dashboardData?.topFeatures && dashboardData.topFeatures.length > 0 ? (
              <div className="space-y-3">
                {dashboardData.topFeatures.slice(0, 5).map((feature, index) => (
                  <div
                    key={feature.name}
                    className="flex justify-between items-center p-3 bg-github-bg-code dark:bg-github-dark-bg-code rounded border border-github-border-light dark:border-github-dark-border-light"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-github-text-primary dark:text-github-dark-text-primary text-sm font-mono">
                        {feature.name}
                      </h4>
                      <p className="text-xs text-github-text-secondary dark:text-github-dark-text-secondary">
                        {feature.checks} checks • {feature.adoptionRate.toFixed(1)}% enabled
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-mono text-github-text-primary dark:text-github-dark-text-primary">
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-github-text-secondary dark:text-github-dark-text-secondary py-8">
                No feature data available
              </p>
            )}
          </div>
        </div>

        {/* Detailed Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SegmentTable segments={dashboardData?.segments || []} />
          <RecentEvents events={dashboardData?.recentEvents || []} />
        </div>
      </div>
    </div>
  )
}