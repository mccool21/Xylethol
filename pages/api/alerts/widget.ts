import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // In production, specify your domains
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400', // 24 hours
}

// Helper function to check if user matches segment criteria
interface UserAttributes {
  userType?: string | null
  location?: string | null
  accountAge?: string | null
  activityLevel?: string | null
  planTier?: string | null
  currentPage?: string | null
}

interface Segment {
  userType?: string | null
  location?: string | null
  accountAge?: string | null
  activityLevel?: string | null
  planTier?: string | null
  targetPage?: string | null
}

function userMatchesSegment(userAttributes: UserAttributes, segment: Segment): boolean {
  if (segment.userType && userAttributes.userType !== segment.userType) return false
  if (segment.location && userAttributes.location !== segment.location) return false
  if (segment.accountAge && userAttributes.accountAge !== segment.accountAge) return false
  if (segment.activityLevel && userAttributes.activityLevel !== segment.activityLevel) return false
  if (segment.planTier && userAttributes.planTier !== segment.planTier) return false
  
  // Page targeting: if segment has targetPage, user's currentPage must match
  if (segment.targetPage && userAttributes.currentPage !== segment.targetPage) return false
  
  return true
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders)
    res.end()
    return
  }

  // Add CORS headers to all responses
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value)
  })

  if (req.method === 'GET' || req.method === 'POST') {
    try {
      const now = new Date()
      
      // Get user attributes from request body (POST) or query params (GET)
      let userAttributes: UserAttributes | null = null
      if (req.method === 'POST' && req.body) {
        const { userType, location, accountAge, activityLevel, planTier, currentPage } = req.body
        if (userType || location || accountAge || activityLevel || planTier || currentPage) {
          userAttributes = { userType, location, accountAge, activityLevel, planTier, currentPage }
        }
      }
      
      // Fetch all active alerts
      const activeAlerts = await prisma.alert.findMany({
        where: {
          isEnabled: true,
          isActiveFrom: {
            lte: now
          },
          isActiveTo: {
            gte: now
          }
        },
        include: {
          targetSegments: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      let filteredAlerts = activeAlerts

      // If user attributes are provided, filter by user segments
      if (userAttributes) {
        filteredAlerts = activeAlerts.filter(alert => {
          // If targeting is not enabled, show to all users
          if (!alert.targetingEnabled || alert.targetSegments.length === 0) {
            return true
          }

          // Check if user matches any of the target segments
          return alert.targetSegments.some(segment => 
            userMatchesSegment(userAttributes, segment)
          )
        })
      } else {
        // If no user attributes provided, only show non-targeted alerts
        filteredAlerts = activeAlerts.filter(alert => 
          !alert.targetingEnabled || alert.targetSegments.length === 0
        )
      }

      // Transform dates to ISO strings for JSON serialization and remove targeting data
      const serializedAlerts = filteredAlerts.map(alert => ({
        id: alert.id,
        title: alert.title,
        body: alert.body,
        theme: alert.theme,
        isActiveFrom: alert.isActiveFrom.toISOString(),
        isActiveTo: alert.isActiveTo.toISOString(),
        createdAt: alert.createdAt.toISOString()
      }))

      res.status(200).json(serializedAlerts)
    } catch (error) {
      console.error('Widget API Error:', error)
      res.status(500).json({ error: 'Failed to fetch active alerts' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS'])
    res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}