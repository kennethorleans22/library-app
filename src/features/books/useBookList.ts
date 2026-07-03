import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse, BooksResponse } from '@/types'

export function useBookList(search: string) {
  return useQuery({
    queryKey: ['book-list', search],
  queryFn: () =>
  apiFetch<ApiResponse<BooksResponse>>(
    `/api/books?q=${encodeURIComponent(search)}&limit=50`
  ),
  })
}