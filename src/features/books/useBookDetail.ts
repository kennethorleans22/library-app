import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse, Book } from '@/types'

export function useBookDetail(id: string | undefined) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => apiFetch<ApiResponse<Book>>(`/api/books/${id}`),
    enabled: !!id, // jangan fetch kalau id belum ada
  })
}