import Keycloak from 'keycloak-js'

// Single shared Keycloak instance for the whole app — Login.tsx (ROPC),
// KeycloakProvider.tsx, and the axios interceptors all read/write this same
// object. Nothing else should construct a second `new Keycloak(...)`.
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
})

export function decodeJwtPayload(token: string) {
  const base64Url = token.split('.')[1]
  if (!base64Url) throw new Error('Invalid token')
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=')
  return JSON.parse(atob(padded))
}

export const TOKEN_KEY = 'kc_token'
export const REFRESH_TOKEN_KEY = 'kc_refresh_token'
export const ID_TOKEN_KEY = 'kc_id_token'

// Single source of truth for the token-storage contract — every read/write
// of the kc_* localStorage keys should go through these two functions
// instead of raw localStorage calls, so the set of persisted keys can
// change in one place. Never log the values passed through here.
export function persistTokens(kc: Pick<typeof keycloak, 'token' | 'refreshToken' | 'idToken'>) {
  if (kc.token) localStorage.setItem(TOKEN_KEY, kc.token)
  if (kc.refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, kc.refreshToken)
  if (kc.idToken) localStorage.setItem(ID_TOKEN_KEY, kc.idToken)
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(ID_TOKEN_KEY)
}

export default keycloak
