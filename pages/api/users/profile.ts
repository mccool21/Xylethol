import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { userId, userType, location, accountAge, activityLevel, planTier } = req.body

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' })
      }

      const userProfile = await prisma.userProfile.upsert({
        where: { userId },
        update: {
          userType,
          location,
          accountAge,
          activityLevel,
          planTier,
          lastSeen: new Date()
        },
        create: {
          userId,
          userType,
          location,
          accountAge,
          activityLevel,
          planTier,
          lastSeen: new Date()
        }
      })

      res.status(200).json(userProfile)
    } catch (error) {
      console.error('Error upserting user profile:', error)
      res.status(500).json({ error: 'Failed to update user profile' })
    }
  } else if (req.method === 'GET') {
    try {
      const { userId } = req.query

      if (!userId || typeof userId !== 'string') {
        return res.status(400).json({ error: 'userId is required' })
      }

      const userProfile = await prisma.userProfile.findUnique({
        where: { userId }
      })

      if (!userProfile) {
        return res.status(404).json({ error: 'User profile not found' })
      }

      res.status(200).json(userProfile)
    } catch (error) {
      console.error('Error fetching user profile:', error)
      res.status(500).json({ error: 'Failed to fetch user profile' })
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}