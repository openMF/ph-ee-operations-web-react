import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { BarChart2, CreditCard, FileText, Tag, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const modules: { label: string; icon: LucideIcon; path: string }[] = [
  { label: 'Payment Hub', icon: CreditCard, path: '/payment-hub' },
  { label: 'Vouchers', icon: Tag, path: '/vouchers' },
  { label: 'Account Mapper', icon: Users, path: '/account-mapper' },
  { label: 'Visualizations', icon: BarChart2, path: '/reporting' },
  { label: 'G2P Payment Config', icon: FileText, path: '/g2p-config' },
]

const TOP_ROW_SIZE = 3

function ModuleCard({
  label,
  icon: Icon,
  path,
  gridColumnStart,
}: {
  label: string
  icon: LucideIcon
  path: string
  gridColumnStart?: number
}) {
  return (
    <Link
      to={path}
      className="col-span-2 block group"
      style={gridColumnStart !== undefined ? { gridColumnStart } : undefined}
    >
      <Card className="h-full cursor-pointer transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg">
        <CardContent className="flex flex-col items-center justify-center py-10 gap-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#1565C0' }}
          >
            <Icon size={28} className="text-white" />
          </div>
          <span className="text-sm font-medium text-gray-600">{label}</span>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function Dashboard() {
  const topRow = modules.slice(0, TOP_ROW_SIZE)
  const bottomRow = modules.slice(TOP_ROW_SIZE)
  // Center the bottom row in the 6-column grid: first item's column start
  const bottomColStart = (6 - bottomRow.length * 2) / 2 + 1

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800 mb-8">Dashboard</h1>

      <div className="grid grid-cols-6 gap-6">
        {topRow.map((mod) => (
          <ModuleCard key={mod.path} {...mod} />
        ))}
        {bottomRow.map((mod, i) => (
          <ModuleCard
            key={mod.path}
            {...mod}
            gridColumnStart={i === 0 ? bottomColStart : undefined}
          />
        ))}
      </div>
    </div>
  )
}
