import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Lock, Eye, EyeOff, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/shared/ToastProvider'
import keycloak, { persistTokens } from '@/lib/keycloak/keycloak'

const TENANTS = ['greenbank', 'bluebank', 'redbank']

const LOGOUT_REASON_MESSAGES: Record<string, string> = {
  inactivity: 'Session ended due to inactivity.',
  expired: 'Your session expired. Please log in again.',
}

export default function Login() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [tenant, setTenant] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Surface why the user landed back here after a hard logout redirect —
  // no in-memory state survives that navigation, so this is passed via
  // sessionStorage by KeycloakProvider/authInterceptors.
  useEffect(() => {
    const reason = sessionStorage.getItem('logout_reason')
    if (reason) {
      toast(LOGOUT_REASON_MESSAGES[reason] ?? 'Session ended.', 'warning')
      sessionStorage.removeItem('logout_reason')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch(
        `${import.meta.env.VITE_KEYCLOAK_URL}/realms/${import.meta.env.VITE_KEYCLOAK_REALM}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'password',
            client_id: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
            username,
            password,
          }),
        },
      )
      const data = await response.json()
      if (data.access_token) {
        // Hand the ROPC tokens to the shared keycloak-js instance so its own
        // updateToken()/logout() have a real refresh/id token to work with —
        // without this, keycloak.token stays undefined forever and silent
        // refresh has nothing to refresh.
        await keycloak.init({
          token: data.access_token,
          refreshToken: data.refresh_token,
          idToken: data.id_token,
        })
        persistTokens(keycloak)
        localStorage.setItem('tenant', tenant)
        navigate('/')
      } else {
        setError('Invalid username or password')
      }
    } catch {
      setError('Unable to reach authentication server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1565C0] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Top accent band */}
        <div className="h-1 bg-linear-to-r from-[#1565C0] via-[#42A5F5] to-[#1565C0]" />

        <div className="px-8 pt-8 pb-8 space-y-6">
          {/* Logo */}
          <div className="flex justify-center pb-2">
            <img
              src="/payment-hub-ee.png"
              alt="Payment Hub EE"
              className="h-14 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="username"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-8"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-8 pr-9"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tenant">Tenant</Label>
              <Select value={tenant} onValueChange={setTenant}>
                <SelectTrigger id="tenant" className="w-full">
                  <SelectValue placeholder="Select tenant" />
                </SelectTrigger>
                <SelectContent>
                  {TENANTS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(v) => setRememberMe(Boolean(v))}
              />
              <Label htmlFor="rememberMe" className="font-normal cursor-pointer text-sm">
                Remember me
              </Label>
            </div>

            {error && (
              <p className="text-xs text-red-600 text-center -mt-1">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1565C0] hover:bg-[#0d47a1] text-white h-9 text-sm font-medium"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground pt-1">
            Powered by Mifos Initiative
          </p>
        </div>
      </div>
    </div>
  )
}
