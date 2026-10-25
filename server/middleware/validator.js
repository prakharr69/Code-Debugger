/**
 * Input validation middleware for POST /api/debug
 * Enforces:
 * - code is present, non-empty, and a string
 * - line count <= 300
 * - character count <= 12,000
 * - error string <= 4,000 characters (if provided)
 */
export function validateDebugRequest(req, res, next) {
  const { code, error } = req.body || {};

  if (code === undefined || code === null) {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Missing "code" field in request body.'
    });
  }

  if (typeof code !== 'string') {
    return res.status(400).json({
      error: 'Invalid input',
      message: '"code" must be a string.'
    });
  }

  const trimmedCode = code.trim();
  if (trimmedCode.length === 0) {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Code cannot be empty. Please provide Python code to debug.'
    });
  }

  if (code.length > 12000) {
    return res.status(400).json({
      error: 'Input limit exceeded',
      message: `Code exceeds maximum allowed character length of 12,000 characters (received ${code.length}).`
    });
  }

  const lines = code.split(/\r?\n/);
  if (lines.length > 300) {
    return res.status(400).json({
      error: 'Input limit exceeded',
      message: `Code exceeds maximum allowed line limit of 300 lines (received ${lines.length}).`
    });
  }

  if (error !== undefined && error !== null) {
    if (typeof error !== 'string') {
      return res.status(400).json({
        error: 'Invalid input',
        message: '"error" traceback must be a string if provided.'
      });
    }

    if (error.length > 4000) {
      return res.status(400).json({
        error: 'Input limit exceeded',
        message: `Error traceback exceeds maximum allowed length of 4,000 characters (received ${error.length}).`
      });
    }
  }

  next();
}
