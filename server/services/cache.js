import { LRUCache } from 'lru-cache';
import crypto from 'crypto';

// In-memory LRU Cache to safeguard Gemini free-tier quota
// Max 100 entries, 24 hours TTL
const cache = new LRUCache({
  max: 100,
  ttl: 1000 * 60 * 60 * 24 // 24 hours in ms
});

/**
 * Generate a deterministic SHA-256 hash key for the code and error traceback
 */
export function generateCacheKey(code, error = '') {
  const normalizedCode = (code || '').trim();
  const normalizedError = (error || '').trim();
  return crypto
    .createHash('sha256')
    .update(`${normalizedCode}::${normalizedError}`)
    .digest('hex');
}

/**
 * Retrieve cached result by key
 */
export function getCachedResult(key) {
  return cache.get(key);
}

/**
 * Store debug analysis result in cache
 */
export function setCachedResult(key, data) {
  cache.set(key, data);
}

/**
 * Get cache stats for diagnostics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    max: cache.max
  };
}

/**
 * Clear cache (useful for testing)
 */
export function clearCache() {
  cache.clear();
}
