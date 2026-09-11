import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { on } from '@/lib/events'
import { useToast } from '@/components/shared/ToastProvider'

// Axios interceptors have no React/Router context, so a 403 response emits
// a 'forbidden' event instead of navigating directly — this component is
// the one place inside the tree that reacts to it.
export default function ForbiddenListener() {
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    return on('forbidden', () => {
      toast("You don't have permission to access this.", 'error')
      navigate('/')
    })
  }, [navigate, toast])

  return null
}
