import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MainBatchesTab from './MainBatchesTab'
import SubBatchesTab from './SubBatchesTab'
import TransfersTab from './TransfersTab'

export default function PaymentHub() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Dashboard
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium">Payment Hub</span>
      </nav>

      <h1 className="text-2xl font-semibold tracking-tight">Payment Hub</h1>

      {/* Tabs */}
      <Tabs defaultValue="main-batches">
        <TabsList variant="line">
          <TabsTrigger value="main-batches">Main Batches</TabsTrigger>
          <TabsTrigger value="sub-batches">Sub Batches</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
        </TabsList>

        <TabsContent value="main-batches" className="mt-4">
          <MainBatchesTab />
        </TabsContent>

        <TabsContent value="sub-batches" className="mt-4">
          <SubBatchesTab />
        </TabsContent>

        <TabsContent value="transfers" className="mt-4">
          <TransfersTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
