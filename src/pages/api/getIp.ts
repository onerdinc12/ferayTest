import { NextApiRequest, NextApiResponse } from 'next'
import rateLimiter from '../../lib/rate-limit'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const forwarded = req.headers["x-forwarded-for"]
  const ip = forwarded 
    ? (typeof forwarded === "string" ? forwarded : forwarded[0])
    : req.socket.remoteAddress || 'unknown'

  // Rate limiting kontrolü
  if (!rateLimiter(ip, 'ip')) {
    return res.status(429).json({ 
      error: 'Çok fazla istek yaptınız. Lütfen biraz bekleyin.' 
    })
  }

  res.status(200).json({ ip: ip || 'unknown' })
} 