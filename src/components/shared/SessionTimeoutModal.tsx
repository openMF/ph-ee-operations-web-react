import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SessionTimeoutModalProps {
  open: boolean
  onStayLoggedIn: () => void
  onLogoutNow: () => void
}

export default function SessionTimeoutModal({
  open,
  onStayLoggedIn,
  onLogoutNow,
}: SessionTimeoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onLogoutNow() }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session about to expire</DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-2 text-sm text-muted-foreground">
          You have been inactive for a while. For your security, you will be
          signed out in 2 minutes unless you choose to stay.
        </div>

        <DialogFooter className="px-0 pb-0">
          <Button type="button" variant="outline" onClick={onLogoutNow}>
            Log out
          </Button>
          <Button
            type="button"
            className="bg-[#1565C0] hover:bg-[#0d47a1] text-white"
            onClick={onStayLoggedIn}
          >
            Stay logged in
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
