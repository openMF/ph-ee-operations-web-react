import { Navigate, Outlet, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useKeycloak } from '@/lib/keycloak/KeycloakProvider'
import { isTokenExpiringSoon } from '@/lib/keycloak/refresh'

// Per-navigation auth guard. KeycloakProvider already blocks rendering
// until the initial auth check resolves and redirects on init failure —
// this is the durable guard that re-checks on every route change, closing
// the gap between an in-background token expiry and the next interval tick.
export default function ProtectedRoute({ children }: { children?: ReactNode }) {
  const { authenticated } = useKeycloak()
  const location = useLocation()

  if (!authenticated || isTokenExpiringSoon(0)) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children ?? <Outlet />
}
