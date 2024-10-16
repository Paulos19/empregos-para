// API Route: /api/check-download-status
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/services/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query;

  const user = await prisma.user.findUnique({
    where: { id: userId as string },
    select: { hasDownloaded: true },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.status(200).json({ hasDownloaded: user.hasDownloaded });
}
