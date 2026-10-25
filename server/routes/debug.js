import express from 'express';
import { validateDebugRequest } from '../middleware/validator.js';
import { debugRateLimiter } from '../middleware/limiter.js';
import { generateCacheKey, getCachedResult, setCachedResult } from '../services/cache.js';
import { analyzePythonCode } from '../services/gemini.js';

const router = express.Router();

/**
 * POST /api/debug
 * Body: { code: string, error?: string }
 */
router.post('/debug', debugRateLimiter, validateDebugRequest, async (req, res, next) => {
  try {
    const { code, error } = req.body;

    // 1. Check in-memory LRU cache
    const cacheKey = generateCacheKey(code, error);
    const cachedResponse = getCachedResult(cacheKey);

    if (cachedResponse) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cachedResponse);
    }

    // 2. Query Gemini AI service
    const analysisResult = await analyzePythonCode({ code, error });

    // 3. Store in cache
    setCachedResult(cacheKey, analysisResult);

    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(analysisResult);
  } catch (err) {
    console.error('[Debug Route Error]:', err.message);

    // If error has specific statusCode (e.g. 502 from service or 429)
    if (err.statusCode) {
      return res.status(err.statusCode).json({
        error: 'AI Service Error',
        message: err.message
      });
    }

    // Map common Gemini quota errors to 429 or 502
    if (err.message?.includes('429') || err.message?.includes('quota') || err.message?.includes('RESOURCE_EXHAUSTED')) {
      return res.status(429).json({
        error: 'Quota Exceeded',
        message: 'Gemini API free-tier quota has been temporarily reached. Please wait a moment and try again.'
      });
    }

    return res.status(502).json({
      error: 'AI Service Error',
      message: 'Failed to communicate with AI debugging service. Please try again in a few moments.'
    });
  }
});

export default router;
