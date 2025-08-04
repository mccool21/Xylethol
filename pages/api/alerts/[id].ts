import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid alert ID' })
  }

  if (req.method === 'GET') {
    try {
      const alert = await prisma.alert.findUnique({
        where: { id },
        include: {
          targetSegments: true
        }
      })

      if (!alert) {
        return res.status(404).json({ error: 'Alert not found' })
      }

      res.status(200).json(alert)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch alert' })
    }
  } else if (req.method === 'PUT') {
    try {
      const { 
        title, 
        body, 
        isEnabled, 
        isActiveFrom, 
        isActiveTo,
        theme,
        targetingEnabled,
        targetSegments 
      } = req.body

      // First, delete existing segments if targeting is being updated
      if (targetingEnabled !== undefined) {
        await prisma.alertSegment.deleteMany({
          where: { alertId: id }
        })
      }

      const alert = await prisma.alert.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(body && { body }),
          ...(typeof isEnabled === 'boolean' && { isEnabled }),
          ...(isActiveFrom && { isActiveFrom: new Date(isActiveFrom) }),
          ...(isActiveTo && { isActiveTo: new Date(isActiveTo) }),
          ...(theme && { theme }),
          ...(typeof targetingEnabled === 'boolean' && { targetingEnabled }),
          ...(targetingEnabled && targetSegments && {
            targetSegments: {
              create: targetSegments.map((segment: any) => ({
                userType: segment.userType || null,
                location: segment.location || null,
                accountAge: segment.accountAge || null,
                activityLevel: segment.activityLevel || null,
                planTier: segment.planTier || null
              }))
            }
          })
        },
        include: {
          targetSegments: true
        }
      })

      res.status(200).json(alert)
    } catch (error) {
      console.error('Error updating alert:', error)
      res.status(500).json({ error: 'Failed to update alert' })
    }
  } else if (req.method === 'DELETE') {
    try {
      await prisma.alert.delete({
        where: { id }
      })

      res.status(204).end()
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete alert' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}