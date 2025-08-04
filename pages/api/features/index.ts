import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // Check if prisma client is properly initialized
      if (!prisma || !prisma.featureToggle) {
        console.error('Prisma client not properly initialized for FeatureToggle model')
        return res.status(500).json({ error: 'Database connection error. Please restart the server.' })
      }

      const featureToggles = await prisma.featureToggle.findMany({
        include: {
          targetSegments: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      })

      // Transform dates to ISO strings for JSON serialization
      const serializedFeatureToggles = featureToggles.map(feature => ({
        ...feature,
        isActiveFrom: feature.isActiveFrom.toISOString(),
        isActiveTo: feature.isActiveTo.toISOString(),
        createdAt: feature.createdAt.toISOString(),
        updatedAt: feature.updatedAt.toISOString()
      }))

      res.status(200).json(serializedFeatureToggles)
    } catch (error) {
      console.error('Error fetching feature toggles:', error)
      res.status(500).json({ error: 'Failed to fetch feature toggles' })
    }
  } else if (req.method === 'POST') {
    try {
      const {
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
      } = req.body

      // Validate required fields
      if (!name || !displayName) {
        return res.status(400).json({ error: 'Name and display name are required' })
      }

      // Check if feature name already exists
      const existingFeature = await prisma.featureToggle.findUnique({
        where: { name }
      })

      if (existingFeature) {
        return res.status(400).json({ error: 'Feature toggle with this name already exists' })
      }

      // Create feature toggle with segments
      const featureToggle = await prisma.featureToggle.create({
        data: {
          name,
          displayName,
          description: description || null,
          isEnabled: isEnabled ?? true,
          environment: environment || 'all',
          rolloutPercentage: rolloutPercentage ?? 100,
          isActiveFrom: new Date(isActiveFrom),
          isActiveTo: new Date(isActiveTo),
          targetingEnabled: targetingEnabled ?? false,
          targetSegments: {
            create: targetingEnabled && targetSegments ? targetSegments.map((segment: any) => ({
              userType: segment.userType || null,
              location: segment.location || null,
              accountAge: segment.accountAge || null,
              activityLevel: segment.activityLevel || null,
              planTier: segment.planTier || null,
              targetPage: segment.targetPage || null
            })) : []
          }
        },
        include: {
          targetSegments: true
        }
      })

      // Transform dates for response
      const serializedFeatureToggle = {
        ...featureToggle,
        isActiveFrom: featureToggle.isActiveFrom.toISOString(),
        isActiveTo: featureToggle.isActiveTo.toISOString(),
        createdAt: featureToggle.createdAt.toISOString(),
        updatedAt: featureToggle.updatedAt.toISOString()
      }

      res.status(201).json(serializedFeatureToggle)
    } catch (error) {
      console.error('Error creating feature toggle:', error)
      res.status(500).json({ error: 'Failed to create feature toggle' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}