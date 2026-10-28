import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import keycloak, { TOKEN_KEY, clearTokens } from '@/lib/keycloak/keycloak'
import { refreshToken } from '@/lib/keycloak/refresh'
import { emit } from '@/lib/events'

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

// Hard redirect, not React Router's navigate() — this runs inside an axios
// interceptor, outside the React tree / Router context. Exported so tests
// can spy on it instead of asserting against a real browser navigation.
export function redirectToLogin(reason: 'expired') {
  sessionStorage.setItem('logout_reason', reason)
  window.location.href = '/login'
}

// Attaches the Platform-TenantId + Authorization headers, activity
// tracking, and 401 (refresh-then-retry) / 403 (friendly redirect) handling
// shared by every axios instance in the app. Never logs token values.
export function createAuthInterceptors(client: AxiosInstance) {
  client.interceptors.request.use((config) => {
    const tenant = localStorage.getItem('tenant') || 'greenbank'
    config.headers.set('Platform-TenantId', tenant)

    const token = keycloak.token ?? localStorage.getItem(TOKEN_KEY)
    if (token) config.headers.set('Authorization', `Bearer ${token}`)

    emit('activity')

    return config
  })

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const status = error.response?.status
      const config = error.config as RetryableConfig | undefined

      if (status === 401 && config && !config._retry) {
        config._retry = true
        const refreshed = await refreshToken()

        if (refreshed) {
          const freshToken = keycloak.token ?? localStorage.getItem(TOKEN_KEY)
          if (freshToken) config.headers.set('Authorization', `Bearer ${freshToken}`)
          return client(config)
        }

        // Refresh itself failed — clear tokens and hand off to the login
        // redirect. KeycloakProvider's own interval/onTokenExpired paths
        // handle the "still logged in but token died" case; this covers
        // the "an API call surfaced it first" case.
        clearTokens()
        redirectToLogin('expired')
        return Promise.reject(error)
      }

      if (status === 403) {
        emit('forbidden')
        return Promise.reject(error)
      }

      return Promise.reject(error)
    }
  )
}
