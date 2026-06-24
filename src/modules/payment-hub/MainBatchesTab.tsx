import { useState } from 'react'
import { mainBatches } from './mocks/mainBatches.mock'
import type { MainBatch } from './types'
import StatusBadge from '@/components/shared/StatusBadge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const statuses: MainBatch['status'][] = [
  'Completed',
  'Partially Authorized',
  'Rejected',
]

export default function MainBatchesTab() {
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = mainBatches.filter(
    (b) => statusFilter === 'all' || b.status === statusFilter
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const paginated = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => {
            setStatusFilter('all')
            setPage(1)
          }}
          className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
            statusFilter === 'all'
              ? 'bg-[#1565C0] text-white border-[#1565C0]'
              : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          All
        </button>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => {
              setStatusFilter(s)
              setPage(1)
            }}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              statusFilter === s
                ? 'bg-[#1565C0] text-white border-[#1565C0]'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Batch Reference</TableHead>
              <TableHead>Start Time</TableHead>
              <TableHead>Completed Time</TableHead>
              <TableHead>Institution ID</TableHead>
              <TableHead>Source Ministry</TableHead>
              <TableHead className="text-right">Instructions</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Payer FSP</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((batch) => (
              <TableRow key={batch.batchReferenceNumber}>
                <TableCell className="font-medium">
                  {batch.batchReferenceNumber}
                </TableCell>
                <TableCell>{batch.startTime}</TableCell>
                <TableCell>{batch.completedTime}</TableCell>
                <TableCell>{batch.registeringInstitutionId}</TableCell>
                <TableCell>{batch.sourceMinistry}</TableCell>
                <TableCell className="text-right">
                  {batch.numberOfInstructions}
                </TableCell>
                <TableCell className="text-right">
                  {batch.amount.toLocaleString()}
                </TableCell>
                <TableCell>{batch.payerFSP}</TableCell>
                <TableCell>
                  <StatusBadge status={batch.status} />
                </TableCell>
              </TableRow>
            ))}
            {paginated.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                  No records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Items per page</span>
            <Select
              value={String(perPage)}
              onValueChange={(v) => {
                setPerPage(Number(v))
                setPage(1)
              }}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>
              {(page - 1) * perPage + 1}–
              {Math.min(page * perPage, filtered.length)} of {filtered.length}
            </span>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
