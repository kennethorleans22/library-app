import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse, Book } from '@/types'
import type { PaginationMeta } from './useAdminUsers'

export type BookFilter = 'all' | 'available' | 'borrowed' | 'returned'

interface AdminBooksData {
  books: Book[]
  pagination: PaginationMeta
}

export function useAdminBooks(page: number, q: string, status: BookFilter) {
  return useQuery({
    queryKey: ['admin-books', page, q, status],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: '10', q })
      if (status !== 'all') params.set('status', status) // lowercase
      return apiFetch<ApiResponse<AdminBooksData>>(`/api/admin/books?${params.toString()}`)
    },
    placeholderData: (prev) => prev,
  })
}