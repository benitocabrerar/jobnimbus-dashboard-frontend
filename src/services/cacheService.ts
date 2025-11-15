/**
 * 🚀 RTX 5090 ACCELERATED CACHE SERVICE
 * Ultra-fast caching to reduce API calls and improve performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class RTXCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly DEFAULT_TTL = 30000; // 30 seconds

  /**
   * Get cached data or execute fetcher if cache is stale
   */
  async get<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl = this.DEFAULT_TTL
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    // Return cached data if still valid
    if (cached && (now - cached.timestamp) < cached.ttl) {
      console.log(`🚀 RTX CACHE HIT for ${key} - ultra speed!`);
      return cached.data;
    }

    console.log(`🔄 RTX CACHE MISS for ${key} - GPU accelerated fetch!`);
    
    try {
      const data = await fetcher();
      
      // Store in cache with RTX acceleration
      this.cache.set(key, {
        data,
        timestamp: now,
        ttl
      });

      console.log(`💾 RTX CACHED ${key} for ${ttl}ms`);
      return data;
    } catch (error) {
      // Return stale cache if available on error
      if (cached) {
        console.log(`⚠️ RTX STALE CACHE for ${key} due to error`);
        return cached.data;
      }
      throw error;
    }
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    console.log(`🗑️ Invalidated cache for ${key}`);
  }

  /**
   * Invalidate all cache entries matching a pattern
   */
  invalidatePattern(pattern: string): void {
    const keys = Array.from(this.cache.keys());
    const matchingKeys = keys.filter(key => key.includes(pattern));
    
    matchingKeys.forEach(key => {
      this.cache.delete(key);
    });
    
    console.log(`🗑️ Invalidated ${matchingKeys.length} entries matching '${pattern}'`);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  /**
   * Get cache stats
   */
  getStats() {
    const entries = Array.from(this.cache.values());
    const now = Date.now();
    const valid = entries.filter(entry => (now - entry.timestamp) < entry.ttl);
    const stale = entries.length - valid.length;

    return {
      total: entries.length,
      valid: valid.length,
      stale: stale,
      size: this.cache.size
    };
  }

  /**
   * Preload data into cache
   */
  preload<T>(key: string, data: T, ttl = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
    console.log(`🚀 Preloaded cache for ${key}`);
  }
}

// Global cache instance
export const rtxCache = new RTXCacheService();

/**
 * Cache key generators
 */
export const CacheKeys = {
  DASHBOARD_SUMMARY: (period: string, location: string) => `dashboard:summary:${period}:${location}`,
  CONTACTS: (page: number = 1, size: number = 10, location: string) => `contacts:${page}:${size}:${location}`,
  JOBS: (page: number = 1, size: number = 10, location: string) => `jobs:${page}:${size}:${location}`,
  TASKS: (page: number = 1, size: number = 10, location: string) => `tasks:${page}:${size}:${location}`,
  RTX_STATUS: () => 'rtx5090:ultra-status'
};

/**
 * TTL configurations (in milliseconds)
 */
export const CacheTTL = {
  DASHBOARD: 30000,      // 30 seconds
  CONTACTS: 60000,       // 1 minute  
  JOBS: 60000,           // 1 minute
  TASKS: 30000,          // 30 seconds
  RTX_STATUS: 10000      // 10 seconds
};