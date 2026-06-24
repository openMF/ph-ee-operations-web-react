export interface MainBatch {
  batchReferenceNumber: string
  startTime: string
  completedTime: string
  registeringInstitutionId: string
  sourceMinistry: string
  numberOfInstructions: number
  amount: number
  payerFSP: string
  status: 'Completed' | 'Partially Authorized' | 'Rejected'
}

export interface Transfer {
  transactionId: string
  startTime: string
  completedTime: string
  sourceMinistry: string
  bulkAmount: number
  payerFSP: string
  status: 'Completed' | 'Partially Authorized' | 'Pending' | 'Rejected'
}
