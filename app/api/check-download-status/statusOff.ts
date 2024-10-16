// API Route: /api/mark-download-as-done
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/app/services/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.body;

  const user = await prisma.user.update({
    where: { id: userId },
    data: { hasDownloaded: true },
  });

  res.status(200).json({ success: true });
}
