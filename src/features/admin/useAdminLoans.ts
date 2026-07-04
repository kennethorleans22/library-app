import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse } from '@/types'
import type { PaginationMeta } from './useAdminUsers'

export type LoanFilter = 'all' | 'active' | 'returned' | 'overdue'

export interface AdminLoan {
  id: number
  status: 'BORROWED' | 'RETURNED'
  displayStatus: string // 'Active' | 'Returned' | 'Overdue'
  borrowedAt: string
  dueAt: string
  returnedAt: string | null
  durationDays: number
  book: {
    id: number
    title: string
    coverImage: string
    author: { id: number; name: string }
    category: { id: number; name: string }
  }
  borrower: { id: number; name: string; email: string; phone: string }
}

interface AdminLoansData {
  loans: AdminLoan[]
  pagination: PaginationMeta
}

export function useAdminLoans(page: number, q: string, status: LoanFilter) {
  return useQuery({
    queryKey: ['admin-loans', page, q, status],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: '10', q })
      if (status !== 'all') params.set('status', status) // WAJIB lowercase
      return apiFetch<ApiResponse<AdminLoansData>>(`/api/admin/loans?${params.toString()}`)
    },
    placeholderData: (prev) => prev,
  })
}