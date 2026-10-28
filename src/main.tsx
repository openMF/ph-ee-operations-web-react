import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import KeycloakProvider from '@/lib/keycloak/KeycloakProvider'
import ProtectedRoute from '@/components/shared/ProtectedRoute'
import ForbiddenListener from '@/components/shared/ForbiddenListener'
import ToastProvider from '@/components/shared/ToastProvider'
import AppLayout from '@/components/shared/AppLayout'
import SplashScreen from '@/pages/SplashScreen'
import LoginPage from '@/pages/LoginPage'
import Dashboard from '@/pages/Dashboard'
import PaymentHub from '@/pages/PaymentHub'
import BatchDetail from '@/pages/BatchDetail'
import Vouchers from '@/pages/Vouchers'
import AccountMapper from '@/pages/AccountMapper'
import G2PConfig from '@/pages/G2PConfig'
import Settings from '@/pages/Settings'
import RBACConfig from '@/pages/RBACConfig'
import Reporting from '@/pages/Reporting'
import Visualizations from '@/pages/Visualizations'
import NotFound from '@/pages/NotFound'
import AccountMapperSelfService from '@/pages/AccountMapperSelfService'

// Thin root wrapper: supplies KeycloakProvider inside the router tree
// so useNavigate is available to the provider.
function AuthRoot() {
  return (
    <KeycloakProvider>
      <ForbiddenListener />
      <Outlet />
    </KeycloakProvider>
  )
}

const queryClient = new QueryClient()

const router = createBrowserRouter([
  // Public routes — no Keycloak wrapper (Keycloak handles its own redirect)
  { path: '/splash', element: <SplashScreen /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/account-mapper/self-service', element: <AccountMapperSelfService /> },

  // Protected routes — wrapped by KeycloakProvider, guarded by ProtectedRoute
  {
    element: <AuthRoot />,
    children: [
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/',
            element: <AppLayout />,
            children: [
              { index: true, element: <Dashboard /> },
              { path: 'payment-hub', element: <PaymentHub /> },
              { path: 'payment-hub/batch/:batchId', element: <BatchDetail /> },
              { path: 'vouchers', element: <Vouchers /> },
              { path: 'account-mapper', element: <AccountMapper /> },
              { path: 'g2p-config', element: <G2PConfig /> },
              { path: 'settings', element: <Settings /> },
              { path: 'rbac', element: <RBACConfig /> },
              { path: 'reporting', element: <Reporting /> },
              { path: 'visualizations', element: <Visualizations /> },
            ],
          },
          { path: '*', element: <NotFound /> },
        ],
      },
    ],
  },
])

async function enableMocking() {
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MSW === 'true') {
    try {
      const { worker } = await import('./mocks/browser')
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
      })
    } catch (e) {
      console.warn('MSW failed to start:', e)
    }
  }
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </QueryClientProvider>
    </StrictMode>,
  )
})
