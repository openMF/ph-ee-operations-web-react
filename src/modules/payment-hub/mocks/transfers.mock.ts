import type { Transfer } from '../types'

export const transfers: Transfer[] = [
  {
    transactionId: 'TXN-90001-2026',
    startTime: '2026-06-01 08:32:00',
    completedTime: '2026-06-01 08:33:15',
    sourceMinistry: 'Ministry of Finance',
    bulkAmount: 45000,
    payerFSP: 'GreenBank',
    status: 'Completed',
  },
  {
    transactionId: 'TXN-90002-2026',
    startTime: '2026-06-02 10:10:00',
    completedTime: '2026-06-02 10:12:30',
    sourceMinistry: 'Ministry of Health',
    bulkAmount: 32000,
    payerFSP: 'BlueBank',
    status: 'Partially Authorized',
  },
  {
    transactionId: 'TXN-90003-2026',
    startTime: '2026-06-03 07:20:00',
    completedTime: '',
    sourceMinistry: 'Ministry of Education',
    bulkAmount: 67500,
    payerFSP: 'RedBank',
    status: 'Pending',
  },
  {
    transactionId: 'TXN-90004-2026',
    startTime: '2026-06-04 14:05:00',
    completedTime: '2026-06-04 14:06:00',
    sourceMinistry: 'Ministry of Agriculture',
    bulkAmount: 18200,
    payerFSP: 'GreenBank',
    status: 'Rejected',
  },
  {
    transactionId: 'TXN-90005-2026',
    startTime: '2026-06-05 09:40:00',
    completedTime: '2026-06-05 09:41:45',
    sourceMinistry: 'Ministry of Finance',
    bulkAmount: 93000,
    payerFSP: 'BlueBank',
    status: 'Completed',
  },
]
