import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import AppLayout from '@/components/shared/AppLayout'
import SplashScreen from '@/pages/SplashScreen'
import LoginPage from '@/pages/LoginPage'
import Dashboard from '@/pages/Dashboard'
import PaymentHub from '@/pages/PaymentHub'
import Vouchers from '@/pages/Vouchers'
import AccountMapper from '@/pages/AccountMapper'
import G2PConfig from '@/pages/G2PConfig'
import Settings from '@/pages/Settings'
import RBACConfig from '@/pages/RBACConfig'
import Reporting from '@/pages/Reporting'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  { path: '/splash', element: <SplashScreen /> },
  { path: '/login', element: <LoginPage /> },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'payment-hub', element: <PaymentHub /> },
      { path: 'vouchers', element: <Vouchers /> },
      { path: 'account-mapper', element: <AccountMapper /> },
      { path: 'g2p-config', element: <G2PConfig /> },
      { path: 'settings', element: <Settings /> },
      { path: 'rbac', element: <RBACConfig /> },
      { path: 'reporting', element: <Reporting /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
)
