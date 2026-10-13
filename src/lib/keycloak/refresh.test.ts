import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const mockKeycloak = {
  updateToken: vi.fn(),
  token: undefined as string | undefined,
  refreshToken: undefined as string | undefined,
  idToken: undefined as string | undefined,
}

vi.mock('./keycloak', async () => {
  const actual = await vi.importActual<typeof import('./keycloak')>('./keycloak')
  return {
    ...actual,
    default: mockKeycloak,
  }
})

// Imported after the mock so it picks up the mocked default export.
const { refreshToken, isTokenExpiringSoon } = await import('./refresh')
const { TOKEN_KEY, REFRESH_TOKEN_KEY, ID_TOKEN_KEY } = await import('./keycloak')

function base64UrlEncode(json: object) {
  const base64 = btoa(JSON.stringify(json))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function fakeToken(exp: number) {
  return `header.${base64UrlEncode({ sub: 'user-1', exp })}.signature`
}

describe('refreshToken', () => {
  beforeEach(() => {
    localStorage.clear()
    mockKeycloak.updateToken.mockReset()
    mockKeycloak.token = undefined
    mockKeycloak.refreshToken = undefined
    mockKeycloak.idToken = undefined
  })

  it('persists the new tokens on a successful refresh', async () => {
    mockKeycloak.updateToken.mockImplementation(async () => {
      mockKeycloak.token = 'new-access-token'
      mockKeycloak.refreshToken = 'new-refresh-token'
      mockKeycloak.idToken = 'new-id-token'
      return true
    })

    const result = await refreshToken()

    expect(result).toBe(true)
    expect(localStorage.getItem(TOKEN_KEY)).toBe('new-access-token')
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe('new-refresh-token')
    expect(localStorage.getItem(ID_TOKEN_KEY)).toBe('new-id-token')
  })

  it('clears all stored tokens and resolves false when refresh fails', async () => {
    localStorage.setItem(TOKEN_KEY, 'stale-access-token')
    localStorage.setItem(REFRESH_TOKEN_KEY, 'stale-refresh-token')
    mockKeycloak.updateToken.mockRejectedValue(new Error('invalid_grant'))

    const result = await refreshToken()

    expect(result).toBe(false)
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBeNull()
  })

  it('retries once after a transient failure before giving up', async () => {
    vi.useFakeTimers()
    mockKeycloak.updateToken
      .mockRejectedValueOnce(new Error('network error'))
      .mockRejectedValueOnce(new Error('network error'))

    const resultPromise = refreshToken()
    await vi.advanceTimersByTimeAsync(2000)
    const result = await resultPromise

    expect(mockKeycloak.updateToken).toHaveBeenCalledTimes(2)
    expect(result).toBe(false)
    vi.useRealTimers()
  })

  it('succeeds on the retry after one transient failure', async () => {
    vi.useFakeTimers()
    mockKeycloak.updateToken.mockRejectedValueOnce(new Error('network error')).mockImplementationOnce(async () => {
      mockKeycloak.token = 'recovered-token'
      return true
    })

    const resultPromise = refreshToken()
    await vi.advanceTimersByTimeAsync(2000)
    const result = await resultPromise

    expect(mockKeycloak.updateToken).toHaveBeenCalledTimes(2)
    expect(result).toBe(true)
    expect(localStorage.getItem(TOKEN_KEY)).toBe('recovered-token')
    vi.useRealTimers()
  })
})

describe('isTokenExpiringSoon', () => {
  afterEach(() => {
    localStorage.clear()
  })

  it('returns true when there is no stored token', () => {
    expect(isTokenExpiringSoon(0)).toBe(true)
  })

  it('returns false for a token with plenty of remaining validity', () => {
    const farFutureExp = Math.floor(Date.now() / 1000) + 3600
    localStorage.setItem('kc_token', fakeToken(farFutureExp))

    expect(isTokenExpiringSoon(5 * 60_000)).toBe(false)
  })

  it('returns true for a token expiring within the given window', () => {
    const soonExp = Math.floor(Date.now() / 1000) + 60
    localStorage.setItem('kc_token', fakeToken(soonExp))

    expect(isTokenExpiringSoon(5 * 60_000)).toBe(true)
  })
})
