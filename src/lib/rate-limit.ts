import { LRUCache } from 'lru-cache'

type RateLimitType = 'vote' | 'captcha' | 'ip' | 'admin_login' | 'mfa_verify'

const rateLimits = {
  vote: 3,     // 1 dakikada max 3 oy denemesi
  captcha: 5,  // 1 dakikada max 5 captcha denemesi
  ip: 10,      // 1 dakikada max 10 IP kontrolü
  admin_login: 5,   // 5 başarısız deneme sonrası 15 dakika bekleme
  mfa_verify: 3     // 1 dakikada max 3 MFA denemesi
}

const rateLimit = new LRUCache({
  max: 10000,         // Maximum 10000 farklı IP
  ttl: 60 * 1000,    // 1 dakika
})

export default function rateLimiter(ip: string, type: RateLimitType) {
  if (typeof window === 'undefined') return true

  const key = `rate_limit_${ip}_${type}`
  const now = Date.now()
  
  // localStorage'dan mevcut limiti al
  const stored = localStorage.getItem(key)
  let attempts = stored ? JSON.parse(stored) : { count: 0, timestamp: now }
  
  // Admin login için özel süre kontrolü
  const timeout = type === 'admin_login' ? 15 * 60 * 1000 : 60 * 1000 // Admin için 15 dakika, diğerleri için 1 dakika
  
  // Timeout süresi geçtiyse sıfırla
  if (now - attempts.timestamp > timeout) {
    attempts = { count: 0, timestamp: now }
  }
  
  // Limit aşıldı mı kontrol et
  if (attempts.count >= rateLimits[type]) {
    const remainingTime = Math.ceil((timeout - (now - attempts.timestamp)) / 1000)
    throw new Error(`Çok fazla deneme yaptınız. Lütfen ${remainingTime} saniye bekleyin.`)
  }
  
  // Deneme sayısını artır
  attempts.count++
  localStorage.setItem(key, JSON.stringify(attempts))
  
  return true
} 