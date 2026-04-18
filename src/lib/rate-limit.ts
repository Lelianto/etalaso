import { NextResponse } from 'next/server'

const store = new Map<string, { count: number; resetAt: number }>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of store) {
    if (val.resetAt < now) store.delete(key)
  }
}, 5 * 60 * 1000)

/**
 * Simple in-memory rate limiter.
 * Returns null if allowed, or a 429 NextResponse if rate limited.
 */
export function rateLimit(
  ip: string,
  prefix: string,
  { limit = 10, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {}
): NextResponse | null {
  const key = `${prefix}:${ip}`
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return null
  }

  entry.count++
  if (entry.count > limit) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: { 'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)) } }
    )
  }

  return null
}

/** Extract client IP from request headers */
export function getIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
