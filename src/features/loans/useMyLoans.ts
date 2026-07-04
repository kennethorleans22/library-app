import { useInfiniteQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import { useAppSelector } from '@/app/hooks'
import type { ApiResponse, Book } from '@/types'

export interface Loan {
  id: number
  status: 'BORROWED' | 'RETURNED' | 'LATE'
  displayStatus: string
  borrowedAt: string
  dueAt: string
  returnedAt: string | null
  durationDays: number
  book: Book
}

interface LoansData {
  loans: Loan[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

const LIMIT = 10

export function useMyLoans() {
  const token = useAppSelector((state) => state.auth.token)

  return useInfiniteQuery({
    queryKey: ['loans', 'my'],
    queryFn: ({ pageParam }) =>
      apiFetch<ApiResponse<LoansData>>(
        `/api/loans/my?page=${pageParam}&limit=${LIMIT}`
      ),
    initialPageParam: 1,
    enabled: !!token,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination
      return page < totalPages ? page + 1 : undefined
    },
  })
}