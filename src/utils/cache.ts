type CacheData = {
  data: any
  timestamp: number
}

export class CacheManager {
  private static instance: CacheManager
  private cache: Map<string, CacheData> = new Map()
  private readonly TTL: number = 1000 * 60 * 5 // 5 dakika

  private constructor() {}

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  get(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null

    if (Date.now() - cached.timestamp > this.TTL) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  clear(): void {
    this.cache.clear()
  }
} 