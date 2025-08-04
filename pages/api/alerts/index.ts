import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const alerts = await prisma.alert.findMany({
        include: {
          targetSegments: true
        },
        orderBy: { createdAt: 'desc' }
      })
      res.status(200).json(alerts)
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch alerts' })
    }
  } else if (req.method === 'POST') {
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

      if (!title || !body || !isActiveFrom || !isActiveTo) {
        return res.status(400).json({ error: 'Missing required fields' })
      }

      const alert = await prisma.alert.create({
        data: {
          title,
          body,
          isEnabled: isEnabled ?? true,
          isActiveFrom: new Date(isActiveFrom),
          isActiveTo: new Date(isActiveTo),
          theme: theme ?? 'default',
          targetingEnabled: targetingEnabled ?? false,
          targetSegments: targetingEnabled && targetSegments ? {
            create: targetSegments.map((segment: any) => ({
              userType: segment.userType || null,
              location: segment.location || null,
              accountAge: segment.accountAge || null,
              activityLevel: segment.activityLevel || null,
              planTier: segment.planTier || null
            }))
          } : undefined
        },
        include: {
          targetSegments: true
        }
      })

      res.status(201).json(alert)
    } catch (error) {
      console.error('Error creating alert:', error)
      res.status(500).json({ error: 'Failed to create alert' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}