// Security middleware collection

/**
 * Rate limiting configuration
 * Prevents brute force attacks and DDoS
 */
export const createRateLimiter = () => {
  // Simple in-memory rate limiter
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 100; // max requests per window
    
    // Cleanup old entries
    for (const [key, data] of requests.entries()) {
      if (now - data.resetTime > windowMs) {
        requests.delete(key);
      }
    }
    
    const userRequests = requests.get(ip) || { count: 0, resetTime: now };
    
    if (now - userRequests.resetTime > windowMs) {
      userRequests.count = 1;
      userRequests.resetTime = now;
    } else {
      userRequests.count++;
    }
    
    requests.set(ip, userRequests);
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - userRequests.count));
    res.setHeader('X-RateLimit-Reset', new Date(userRequests.resetTime + windowMs).toISOString());
    
    if (userRequests.count > maxRequests) {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please try again later',
        retryAfter: Math.ceil((userRequests.resetTime + windowMs - now) / 1000)
      });
    }
    
    next();
  };
};

/**
 * Stricter rate limiter for auth endpoints
 */
export const createAuthRateLimiter = () => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 5; // Only 5 attempts per window for login/register
    
    // Cleanup old entries
    for (const [key, data] of requests.entries()) {
      if (now - data.resetTime > windowMs) {
        requests.delete(key);
      }
    }
    
    const userRequests = requests.get(ip) || { count: 0, resetTime: now };
    
    if (now - userRequests.resetTime > windowMs) {
      userRequests.count = 1;
      userRequests.resetTime = now;
    } else {
      userRequests.count++;
    }
    
    requests.set(ip, userRequests);
    
    if (userRequests.count > maxRequests) {
      return res.status(429).json({
        error: 'Too many login attempts',
        message: 'Please try again after 15 minutes',
        retryAfter: Math.ceil((userRequests.resetTime + windowMs - now) / 1000)
      });
    }
    
    next();
  };
};

/**
 * Security headers middleware
 */
export const securityHeaders = (req, res, next) => {
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Enable XSS protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Content Security Policy (basic)
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  
  next();
};

/**
 * Request sanitization
 */
export const sanitizeInput = (req, res, next) => {
  // Remove any potential XSS from string inputs
  const sanitize = (obj) => {
    if (typeof obj === 'string') {
      // Remove script tags and javascript: protocols
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
    }
    if (typeof obj === 'object' && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };
  
  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  
  next();
};

/**
 * Simple request logger
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log response when finished
  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get('user-agent')
    };
    
    // Only log in non-test environment
    if (process.env.NODE_ENV !== 'test') {
      const logLevel = res.statusCode >= 400 ? 'ERROR' : 'INFO';
      console.log(`[${logLevel}]`, JSON.stringify(log));
    }
  });
  
  next();
};

