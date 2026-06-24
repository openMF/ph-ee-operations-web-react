import { cn } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700',
  'Partially Authorized': 'bg-orange-100 text-orange-700',
  Rejected: 'bg-red-100 text-red-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Failed: 'bg-red-100 text-red-700',
  Active: 'bg-purple-100 text-purple-700',
  Inactive: 'bg-gray-100 text-gray-500',
}

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusStyles[status] ?? 'bg-gray-100 text-gray-600'
      )}
    >
      {status}
    </span>
  )
}
