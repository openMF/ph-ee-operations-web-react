import { describe, it, expect, vi, beforeAll, afterEach, afterAll } from 'vitest'
import axios from 'axios'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer()

vi.mock('@/lib/keycloak/refresh', () => ({
  refreshToken: vi.fn(),
}))
vi.mock('@/lib/events', () => ({
  emit: vi.fn(),
}))

const { createAuthInterceptors, redirectToLogin } = await import('./authInterceptors')
const { refreshToken } = await import('@/lib/keycloak/refresh')
const { emit } = await import('@/lib/events')

const BASE_URL = 'https://api.test'

describe('createAuthInterceptors', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))
  afterEach(() => {
    server.resetHandlers()
    vi.clearAllMocks()
  })
  afterAll(() => server.close())

  it('on 401, retries the original request once after a successful refresh', async () => {
    let callCount = 0
    server.use(
      http.get(`${BASE_URL}/data`, () => {
        callCount += 1
        if (callCount === 1) {
          return new HttpResponse(null, { status: 401 })
        }
        return HttpResponse.json({ ok: true })
      })
    )
    vi.mocked(refreshToken).mockResolvedValue(true)

    const client = axios.create({ baseURL: BASE_URL })
    createAuthInterceptors(client)

    const response = await client.get('/data')

    expect(response.data).toEqual({ ok: true })
    expect(callCount).toBe(2)
    expect(refreshToken).toHaveBeenCalledTimes(1)
  })

  it('on 401 with a failed refresh, does not retry and redirects to login', async () => {
    let callCount = 0
    server.use(
      http.get(`${BASE_URL}/data`, () => {
        callCount += 1
        return new HttpResponse(null, { status: 401 })
      })
    )
    vi.mocked(refreshToken).mockResolvedValue(false)

    // jsdom doesn't implement real navigation — stub the setter so the
    // interceptor's window.location.href assignment doesn't log a warning.
    const originalHref = window.location.href
    const hrefSetter = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { ...window.location, set href(value: string) { hrefSetter(value) } },
      writable: true,
    })

    const client = axios.create({ baseURL: BASE_URL })
    createAuthInterceptors(client)

    await expect(client.get('/data')).rejects.toBeTruthy()
    expect(callCount).toBe(1)
    expect(sessionStorage.getItem('logout_reason')).toBe('expired')
    expect(hrefSetter).toHaveBeenCalledWith('/login')

    sessionStorage.removeItem('logout_reason')
    Object.defineProperty(window, 'location', { value: { ...window.location, href: originalHref }, writable: true })
  })

  it('on 403, emits a forbidden event exactly once with no retry', async () => {
    let callCount = 0
    server.use(
      http.get(`${BASE_URL}/data`, () => {
        callCount += 1
        return new HttpResponse(null, { status: 403 })
      })
    )

    const client = axios.create({ baseURL: BASE_URL })
    createAuthInterceptors(client)

    await expect(client.get('/data')).rejects.toBeTruthy()
    expect(callCount).toBe(1)
    expect(emit).toHaveBeenCalledWith('forbidden')
    expect(vi.mocked(emit).mock.calls.filter(([type]) => type === 'forbidden')).toHaveLength(1)
  })
})

describe('redirectToLogin', () => {
  it('is exported as a standalone function for testability', () => {
    expect(typeof redirectToLogin).toBe('function')
  })
})
