import { LRUCache } from 'lru-cache'

type RateLimitType = 'vote' | 'captcha' | 'ip'

const rateLimits = {
  vote: 3,     // 1 dakikada max 3 oy denemesi
  captcha: 5,  // 1 dakikada max 5 captcha denemesi
  ip: 10       // 1 dakikada max 10 IP kontrolü
}

const rateLimit = new LRUCache({
  max: 10000,         // Maximum 10000 farklı IP
  ttl: 60 * 1000,    // 1 dakika
})

export default function rateLimiter(ip: string, type: RateLimitType) {
  const key = `${ip}-${type}`
  const tokenCount = rateLimit.get(key) as number || 0
  
  if (tokenCount >= rateLimits[type]) {
    return false
  }

  rateLimit.set(key, tokenCount + 1)
  return true
} 