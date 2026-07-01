import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../lib/api'
import type { ApiResponse, BooksResponse } from '../../types'

export function useBooks() {
  return useQuery({
    queryKey: ['books'],
    queryFn: () => apiFetch<ApiResponse<BooksResponse>>('/api/books?page=1&limit=12'),
  })
}