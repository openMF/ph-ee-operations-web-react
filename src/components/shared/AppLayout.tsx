import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Bell, HelpCircle, Search, User } from 'lucide-react'
import { APP_NAME, DEFAULT_TENANT, TENANTS } from '@/config/constants'

const navItems = [
  { label: 'Dashboard', path: '/' },
  { label: 'Settings', path: '/settings' },
]

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [tenant, setTenant] = useState(
    localStorage.getItem('tenant') ?? DEFAULT_TENANT
  )

  function handleTenantChange(value: string) {
    setTenant(value)
    localStorage.setItem('tenant', value)
  }

  return (
    <div className="flex h-screen bg-[#F5F7FA]">
      {/* Sidebar */}
      <aside
        style={{ width: 240, backgroundColor: '#1565C0' }}
        className="flex flex-col text-white shrink-0"
      >
        {/* Logo */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-center">
          <div className="bg-white rounded px-2 py-1">
            <img
              src="/payment-hub-ee.png"
              alt={APP_NAME}
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={[
                'flex items-center px-6 py-3 text-sm font-medium transition-colors',
                location.pathname === item.path
                  ? 'bg-white/20 text-white'
                  : 'text-white/80 hover:bg-white/10 hover:text-white',
              ].join(' ')}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Back button */}
        <div className="px-6 py-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-white/70 hover:text-white"
          >
            ← Back
          </button>
        </div>
      </aside>

      {/* Right panel */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-3 shrink-0">
          {/* Language */}
          <select aria-label="Language" className="text-sm border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white">
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>

          {/* Tenant switcher */}
          <select
            aria-label="Tenant"
            className="text-sm border border-gray-200 rounded px-2 py-1 text-gray-600 bg-white"
            value={tenant}
            onChange={(e) => handleTenantChange(e.target.value)}
          >
            {TENANTS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <button
            type="button"
            aria-label="Notifications"
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            aria-label="Search"
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            aria-label="Help"
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <HelpCircle size={18} />
          </button>

          {/* User avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#1565C0' }}
          >
            <User size={15} className="text-white" />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
