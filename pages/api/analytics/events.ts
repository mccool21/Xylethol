import type { NextApiRequest, NextApiResponse } from 'next'
import type { AnalyticsEvent } from '../../../types/analytics'

import { events } from './dashboard'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const event: AnalyticsEvent = req.body
      
      console.log('📊 Analytics Event Received:', JSON.stringify(event, null, 2))

      // Validate required fields
      if (!event.type || !event.timestamp) {
        console.log('❌ Validation failed - missing type or timestamp')
        return res.status(400).json({ error: 'Missing required fields: type, timestamp' })
      }

      // Add server-side timestamp if not provided
      if (!event.timestamp) {
        event.timestamp = new Date().toISOString()
      }

      // Store the event
      events.push(event)
      console.log(`✅ Event stored. Total events: ${events.length}`)

      // Keep only last 10,000 events to prevent memory issues
      if (events.length > 10000) {
        events.splice(0, events.length - 10000)
      }

      res.status(201).json({ success: true, eventId: event.id, totalEvents: events.length })
    } catch (error) {
      console.error('❌ Error storing analytics event:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'GET') {
    try {
      const { 
        limit = '100', 
        offset = '0',
        type,
        startDate,
        endDate,
        userId 
      } = req.query

      let filteredEvents = [...events]

      // Filter by type
      if (type && typeof type === 'string') {
        filteredEvents = filteredEvents.filter(event => event.type === type)
      }

      // Filter by date range
      if (startDate && typeof startDate === 'string') {
        const start = new Date(startDate)
        filteredEvents = filteredEvents.filter(event => new Date(event.timestamp) >= start)
      }

      if (endDate && typeof endDate === 'string') {
        const end = new Date(endDate)
        filteredEvents = filteredEvents.filter(event => new Date(event.timestamp) <= end)
      }

      // Filter by user ID
      if (userId && typeof userId === 'string') {
        filteredEvents = filteredEvents.filter(event => event.userId === userId)
      }

      // Sort by timestamp (newest first)
      filteredEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      // Apply pagination
      const limitNum = parseInt(limit as string, 10)
      const offsetNum = parseInt(offset as string, 10)
      const paginatedEvents = filteredEvents.slice(offsetNum, offsetNum + limitNum)

      res.status(200).json({
        events: paginatedEvents,
        total: filteredEvents.length,
        limit: limitNum,
        offset: offsetNum
      })
    } catch (error) {
      console.error('Error retrieving analytics events:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ error: 'Method not allowed' })
  }
}