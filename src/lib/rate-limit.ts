import { NextRequest } from 'next/server'

interface RateLimitEntry {
  count: number
  resetTime: number
}

// In-memory rate limiter (for production, use Redis)
const rateLimiter = new Map<string, RateLimitEntry>()

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of rateLimiter.entries()) {
    if (now > value.resetTime) {
      rateLimiter.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  limit: number // requests per window
  window: number // window in milliseconds
}

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  return forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1'
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 10, window: 60 * 1000 }
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const current = rateLimiter.get(identifier)

  // No entry or expired - create new
  if (!current || now > current.resetTime) {
    const resetTime = now + config.window
    rateLimiter.set(identifier, { count: 1, resetTime })
    return { success: true, remaining: config.limit - 1, resetTime }
  }

  // Check if limit exceeded
  if (current.count >= config.limit) {
    return { success: false, remaining: 0, resetTime: current.resetTime }
  }

  // Increment count
  current.count++
  return { 
    success: true, 
    remaining: config.limit - current.count, 
    resetTime: current.resetTime 
  }
}

export function rateLimitMiddleware(
  request: NextRequest,
  config?: RateLimitConfig
): { allowed: boolean; headers: Record<string, string> } {
  const ip = getClientIP(request)
  const result = checkRateLimit(ip, config)

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': config?.limit.toString() || '10',
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  }

  if (!result.success) {
    headers['Retry-After'] = Math.ceil((result.resetTime - Date.now()) / 1000).toString()
  }

  return { allowed: result.success, headers }
}
