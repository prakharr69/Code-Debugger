import rateLimit from 'express-rate-limit';

/**
 * Rate limiter middleware to prevent quota exhaustion
 * 10 requests per minute per IP
 */
export const debugRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // Limit each IP to 10 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  statusCode: 429,
  message: {
    error: 'Rate limit exceeded',
    message: 'Too many debug requests from this IP. Please wait a minute before submitting again.'
  }
});
