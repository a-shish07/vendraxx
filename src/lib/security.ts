import { NextResponse } from 'next/server'

const attempts = new Map<string, { count: number; resetAt: number }>()

function getClientKey(req: Request, scope: string) {
  const forwarded = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  const ip = forwarded || req.headers.get('x-real-ip') || 'unknown'
  return `${scope}:${ip}`
}

/** Reject obvious cross-site state-changing requests. Same-origin browser requests normally send Origin. */
export function assertSameOrigin(req: Request) {
  const fetchSite = req.headers.get('sec-fetch-site')
  if (fetchSite === 'cross-site') throw new Error('CSRF')
  const origin = req.headers.get('origin')
  if (!origin) return
  const expected = new URL(req.url).origin
  if (origin !== expected) throw new Error('CSRF')
}

/** Lightweight process-local guard for high-value endpoints. Use a shared store for strict distributed rate limiting. */
export function rateLimit(req: Request, scope: string, max: number, windowMs: number) {
  const now = Date.now()
  const key = getClientKey(req, scope)
  const current = attempts.get(key)
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }
  current.count += 1
  if (current.count > max) {
    return { ok: false, retryAfter: Math.ceil((current.resetAt - now) / 1000) }
  }
  return { ok: true, retryAfter: 0 }
}

export function securityError(error: unknown) {
  if (error instanceof Error && error.message === 'CSRF') {
    return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
  }
  return null
}
