import { useState } from 'react'
import Head from 'next/head'

export default function TestAnalytics() {
  const [response, setResponse] = useState<string>('')
  const [events, setEvents] = useState<any[]>([])

  const sendTestEvent = async () => {
    try {
      const testEvent = {
        id: `test_${Date.now()}`,
        type: 'alert_show',
        timestamp: new Date().toISOString(),
        sessionId: 'test_session',
        userId: 'test_user',
        alertId: 'test_alert_123',
        alertTitle: 'Test Alert',
        alertTheme: 'default',
        userAttributes: {
          userType: 'test',
          location: 'US',
          planTier: 'free'
        }
      }

      const res = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testEvent)
      })

      const result = await res.json()
      setResponse(`Event sent: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      setResponse(`Error: ${error}`)
    }
  }

  const getEvents = async () => {
    try {
      const res = await fetch('/api/analytics/events')
      const result = await res.json()
      setEvents(result.events || [])
      setResponse(`Retrieved ${result.events?.length || 0} events`)
    } catch (error) {
      setResponse(`Error: ${error}`)
    }
  }

  const getDashboard = async () => {
    try {
      const res = await fetch('/api/analytics/dashboard')
      const result = await res.json()
      setResponse(`Dashboard data: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      setResponse(`Error: ${error}`)
    }
  }

  const sendAlertEvent = async () => {
    try {
      const event = {
        id: `alert_${Date.now()}`,
        type: 'alert_show',
        timestamp: new Date().toISOString(),
        sessionId: 'test_session',
        userId: 'demo-user',
        alertId: 'demo_alert_123',
        alertTitle: 'Demo Alert Title',
        alertTheme: 'default',
        userAttributes: {
          userType: 'demo',
          location: 'US',
          planTier: 'free',
          currentPage: '/test'
        }
      }

      const res = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })

      const result = await res.json()
      setResponse(`Alert event sent: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      setResponse(`Error: ${error}`)
    }
  }

  const sendFeatureEvent = async () => {
    try {
      const event = {
        id: `feature_${Date.now()}`,
        type: 'feature_check',
        timestamp: new Date().toISOString(),
        sessionId: 'test_session',
        userId: 'demo-user-123',
        featureName: 'demo_feature',
        featureEnabled: true,
        userAttributes: {
          userType: 'demo',
          location: 'US',
          planTier: 'free',
          currentPage: '/test'
        }
      }

      const res = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(event)
      })

      const result = await res.json()
      setResponse(`Feature event sent: ${JSON.stringify(result, null, 2)}`)
    } catch (error) {
      setResponse(`Error: ${error}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Head>
        <title>Analytics API Test</title>
      </Head>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Analytics API Test</h1>

        <div className="space-y-4 mb-8">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={sendTestEvent}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Send Test Event
            </button>
            <button
              onClick={sendAlertEvent}
              className="bg-orange-600 text-white px-4 py-2 rounded"
            >
              Send Alert Event
            </button>
            <button
              onClick={sendFeatureEvent}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              Send Feature Event
            </button>
            <button
              onClick={getEvents}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Get Events
            </button>
            <button
              onClick={getDashboard}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Get Dashboard Data
            </button>
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Response:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {response}
          </pre>
        </div>

        {events.length > 0 && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-semibold mb-4">Events ({events.length}):</h2>
            <div className="space-y-2">
              {events.map((event, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded">
                  <div className="font-mono text-sm">
                    <div><strong>Type:</strong> {event.type}</div>
                    <div><strong>Time:</strong> {event.timestamp}</div>
                    <div><strong>User:</strong> {event.userId}</div>
                    {event.alertTitle && <div><strong>Alert:</strong> {event.alertTitle}</div>}
                    {event.featureName && <div><strong>Feature:</strong> {event.featureName}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}