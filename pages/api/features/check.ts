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
  userId?: string | null // For percentage-based rollouts
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

// Simple hash function for consistent percentage-based rollouts
function hashUserId(userId: string, featureName: string): number {
  let hash = 0
  const str = `${userId}:${featureName}`
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash) % 100
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

  if (req.method === 'POST') {
    try {
      const { features, userAttributes } = req.body

      if (!features || !Array.isArray(features)) {
        return res.status(400).json({ error: 'Features array is required' })
      }

      const now = new Date()
      const results: Record<string, boolean> = {}

      // Fetch all requested features
      const featureToggles = await prisma.featureToggle.findMany({
        where: {
          name: {
            in: features
          }
        },
        include: {
          targetSegments: true
        }
      })

      for (const featureName of features) {
        const feature = featureToggles.find(f => f.name === featureName)
        
        // Default to false if feature doesn't exist
        if (!feature) {
          results[featureName] = false
          continue
        }

        // Check if feature is globally enabled
        if (!feature.isEnabled) {
          results[featureName] = false
          continue
        }

        // Check if feature is within active time window
        if (now < feature.isActiveFrom || now > feature.isActiveTo) {
          results[featureName] = false
          continue
        }

        // Check environment (if specified in request)
        const environment = userAttributes?.environment || 'production'
        if (feature.environment !== 'all' && feature.environment !== environment) {
          results[featureName] = false
          continue
        }

        // Check percentage-based rollout
        if (feature.rolloutPercentage < 100) {
          const userId = userAttributes?.userId || 'anonymous'
          const userHash = hashUserId(userId, featureName)
          
          if (userHash >= feature.rolloutPercentage) {
            results[featureName] = false
            continue
          }
        }

        // Check user targeting
        if (feature.targetingEnabled && feature.targetSegments.length > 0 && userAttributes) {
          const matchesAnySegment = feature.targetSegments.some(segment => 
            userMatchesSegment(userAttributes, segment)
          )
          
          if (!matchesAnySegment) {
            results[featureName] = false
            continue
          }
        } else if (feature.targetingEnabled && feature.targetSegments.length > 0 && !userAttributes) {
          // Feature has targeting but no user attributes provided
          results[featureName] = false
          continue
        }

        // All checks passed
        results[featureName] = true
      }

      res.status(200).json(results)
    } catch (error) {
      console.error('Feature Check API Error:', error)
      res.status(500).json({ error: 'Failed to check feature toggles' })
    }
  } else if (req.method === 'GET') {
    // Simple health check endpoint
    try {
      const activeFeatures = await prisma.featureToggle.count({
        where: {
          isEnabled: true,
          isActiveFrom: {
            lte: new Date()
          },
          isActiveTo: {
            gte: new Date()
          }
        }
      })

      res.status(200).json({ 
        status: 'ok',
        activeFeatures,
        timestamp: new Date().toISOString()
      })
    } catch (error) {
      console.error('Feature Check Health Error:', error)
      res.status(500).json({ error: 'Health check failed' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS'])
    res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}