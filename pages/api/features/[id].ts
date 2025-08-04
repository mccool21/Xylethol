import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid feature toggle ID' })
  }

  if (req.method === 'GET') {
    try {
      const featureToggle = await prisma.featureToggle.findUnique({
        where: { id },
        include: {
          targetSegments: true
        }
      })

      if (!featureToggle) {
        return res.status(404).json({ error: 'Feature toggle not found' })
      }

      // Transform dates for response
      const serializedFeatureToggle = {
        ...featureToggle,
        isActiveFrom: featureToggle.isActiveFrom.toISOString(),
        isActiveTo: featureToggle.isActiveTo.toISOString(),
        createdAt: featureToggle.createdAt.toISOString(),
        updatedAt: featureToggle.updatedAt.toISOString()
      }

      res.status(200).json(serializedFeatureToggle)
    } catch (error) {
      console.error('Error fetching feature toggle:', error)
      res.status(500).json({ error: 'Failed to fetch feature toggle' })
    }
  } else if (req.method === 'PUT') {
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

      // Check if feature name already exists for a different feature
      const existingFeature = await prisma.featureToggle.findUnique({
        where: { name }
      })

      if (existingFeature && existingFeature.id !== id) {
        return res.status(400).json({ error: 'Feature toggle with this name already exists' })
      }

      // Delete existing segments and create new ones
      await prisma.featureSegment.deleteMany({
        where: { featureId: id }
      })

      const featureToggle = await prisma.featureToggle.update({
        where: { id },
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

      res.status(200).json(serializedFeatureToggle)
    } catch (error) {
      console.error('Error updating feature toggle:', error)
      res.status(500).json({ error: 'Failed to update feature toggle' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.featureToggle.delete({
        where: { id }
      })

      res.status(200).json({ message: 'Feature toggle deleted successfully' })
    } catch (error) {
      console.error('Error deleting feature toggle:', error)
      res.status(500).json({ error: 'Failed to delete feature toggle' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }
}