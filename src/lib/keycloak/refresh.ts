// Framework-agnostic — no React import — so this can be used from both
// KeycloakProvider.tsx and the axios interceptors without a circular import
// between a file that exports React hooks/components and one axios needs.
import keycloak, { decodeJwtPayload, persistTokens, clearTokens, TOKEN_KEY } from './keycloak'

const MIN_VALIDITY_SECONDS = 300 // refresh if less than 5 min of validity remains
const RETRY_DELAY_MS = 2000

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function attemptUpdateToken(): Promise<boolean> {
  const refreshed = await keycloak.updateToken(MIN_VALIDITY_SECONDS)
  if (refreshed) persistTokens(keycloak)
  return true
}

// Silently refreshes the access token via keycloak-js's own updateToken(),
// which uses the refresh token keycloak-js was hydrated with (see
// Login.tsx / KeycloakProvider.tsx). Never logs token values — only the
// boolean outcome is observable from here.
export async function refreshToken(): Promise<boolean> {
  try {
    return await attemptUpdateToken()
  } catch {
    // Could be a transient network error rather than a truly invalid
    // refresh token — give it one more try before giving up.
    await delay(RETRY_DELAY_MS)
    try {
      return await attemptUpdateToken()
    } catch {
      clearTokens()
      return false
    }
  }
}

// Pure check against the persisted access token — usable standalone
// (e.g. in ProtectedRoute or tests) without depending on keycloak-js
// instance state, which may not be hydrated yet on a fresh page load.
export function isTokenExpiringSoon(minValidityMs: number): boolean {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return true

  try {
    const payload = decodeJwtPayload(token)
    const msUntilExpiry = payload.exp * 1000 - Date.now()
    return msUntilExpiry < minValidityMs
  } catch {
    return true
  }
}
