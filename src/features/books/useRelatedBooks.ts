import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse, BooksResponse } from '@/types'

export function useRelatedBooks(categoryId: number) {
  return useQuery({
    queryKey: ['related-books', categoryId],
    queryFn: () =>
      apiFetch<ApiResponse<BooksResponse>>(`/api/books?categoryId=${categoryId}&limit=6`),
    enabled: !!categoryId,
  })
}