import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import keycloak, {
  decodeJwtPayload,
  persistTokens,
  clearTokens,
  TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  ID_TOKEN_KEY,
} from './keycloak'
import { refreshToken as silentRefresh } from './refresh'
import { useIdleTimer } from './useIdleTimer'
import { useToast } from '@/components/shared/ToastProvider'
import SessionTimeoutModal from '@/components/shared/SessionTimeoutModal'

const REFRESH_CHECK_INTERVAL_MS = 60_000
const REFRESH_IF_UNDER_MS = 5 * 60_000 // proactively refresh once < 5 min remain

const INACTIVITY_IDLE_MS = 15 * 60_000 // 15 min of no activity
const INACTIVITY_WARN_BEFORE_MS = 2 * 60_000 // warn 2 min before that

type LogoutReason = 'inactivity' | 'expired' | 'manual'

interface KeycloakContextValue {
  keycloak: typeof keycloak
  authenticated: boolean
  token: string | undefined
  logout: (reason?: LogoutReason) => void
}

const KeycloakContext = createContext<KeycloakContextValue | null>(null)

export function useKeycloak() {
  const ctx = useContext(KeycloakContext)
  if (!ctx) throw new Error('useKeycloak must be used inside KeycloakProvider')
  return ctx
}

export default function KeycloakProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [initialized, setInitialized] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [showTimeoutModal, setShowTimeoutModal] = useState(false)
  const refreshInFlightRef = useRef(false)

  function logout(reason: LogoutReason = 'manual') {
    clearTokens()
    if (reason !== 'manual') {
      sessionStorage.setItem('logout_reason', reason)
    }
    // keycloak-js was hydrated with the real refresh/id token at login time,
    // so this performs genuine RP-initiated logout against Keycloak's
    // end-session endpoint (server-side revocation), not just a local clear.
    keycloak.logout({ redirectUri: `${window.location.origin}/login` })
  }

  const idleTimer = useIdleTimer({
    idleMs: INACTIVITY_IDLE_MS,
    warnBeforeMs: INACTIVITY_WARN_BEFORE_MS,
    onWarn: () => setShowTimeoutModal(true),
    onIdle: () => logout('inactivity'),
  })

  async function handleStayLoggedIn() {
    setShowTimeoutModal(false)
    await silentRefresh()
    idleTimer.reset()
  }

  useEffect(() => {
    // Already initialized by Login.tsx's ROPC flow in this tab session —
    // keycloak-js throws if init() is called a second time, so just read
    // its current state instead of re-initializing.
    if (keycloak.didInitialize) {
      setAuthenticated(keycloak.authenticated ?? false)
      if (keycloak.token) persistTokens(keycloak)
      setInitialized(true)
      return
    }

    // Reload case: keycloak-js is a fresh instance with no in-memory state,
    // but a previous ROPC login may have left tokens in localStorage —
    // re-hydrate the singleton from them so updateToken()/logout() keep
    // working after a refresh.
    const existingToken = localStorage.getItem(TOKEN_KEY)
    const existingRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    const existingIdToken = localStorage.getItem(ID_TOKEN_KEY)

    if (existingToken) {
      try {
        const payload = decodeJwtPayload(existingToken)
        if (payload.exp * 1000 > Date.now()) {
          keycloak
            .init({
              token: existingToken,
              refreshToken: existingRefreshToken ?? undefined,
              idToken: existingIdToken ?? undefined,
            })
            .then((auth) => {
              setAuthenticated(auth)
              if (auth) persistTokens(keycloak)
              else clearTokens()
              setInitialized(true)
            })
            .catch(() => {
              clearTokens()
              setAuthenticated(false)
              setInitialized(true)
            })
          return
        } else {
          clearTokens()
        }
      } catch {
        clearTokens()
      }
    }

    // No usable ROPC session — fall back to the redirect-based OIDC flow
    // (kept as a defensive path; harmless even though ROPC is the only
    // login entry point in this app today).
    keycloak
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        pkceMethod: 'S256',
      })
      .then((auth) => {
        setAuthenticated(auth)
        if (auth) {
          persistTokens(keycloak)
        } else {
          clearTokens()
          navigate('/login', { replace: true })
        }
        setInitialized(true)
      })
      .catch(() => {
        setInitialized(true)
        navigate('/login', { replace: true })
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Set once initialization has resolved either way, so it always refers
  // to a live keycloak instance with onTokenExpired wiring in place.
  useEffect(() => {
    if (!initialized) return

    keycloak.onTokenExpired = () => {
      silentRefresh().then((ok) => {
        if (!ok) {
          setAuthenticated(false)
          navigate('/login', { replace: true })
        }
      })
    }
  }, [initialized, navigate])

  // Proactive refresh loop: while a session is active, check the token's
  // remaining validity and refresh it well before it actually expires.
  // onTokenExpired above remains a defense-in-depth backstop for cases
  // where a tick is missed entirely (e.g. laptop sleep).
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token || refreshInFlightRef.current) return

      let msUntilExpiry: number
      try {
        msUntilExpiry = decodeJwtPayload(token).exp * 1000 - Date.now()
      } catch {
        setAuthenticated(false)
        navigate('/login', { replace: true })
        return
      }

      if (msUntilExpiry >= REFRESH_IF_UNDER_MS) return

      refreshInFlightRef.current = true
      const ok = await silentRefresh()
      refreshInFlightRef.current = false

      if (!ok) {
        setAuthenticated(false)
        toast('Your session has expired. Please log in again.', 'error')
        navigate('/login', { replace: true })
      }
    }, REFRESH_CHECK_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [navigate, toast])

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-2 border-[#1565C0] border-t-transparent animate-spin" />
          <p className="text-sm text-gray-500">Initializing session…</p>
        </div>
      </div>
    )
  }

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, token: keycloak.token, logout }}>
      {children}
      <SessionTimeoutModal
        open={showTimeoutModal}
        onStayLoggedIn={handleStayLoggedIn}
        onLogoutNow={() => { setShowTimeoutModal(false); logout('inactivity') }}
      />
    </KeycloakContext.Provider>
  )
}
