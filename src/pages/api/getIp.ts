import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const forwarded = req.headers["x-forwarded-for"]
  const ip = forwarded 
    ? (typeof forwarded === "string" ? forwarded : forwarded[0])
    : req.socket.remoteAddress

  res.status(200).json({ ip: ip || 'unknown' })
} 