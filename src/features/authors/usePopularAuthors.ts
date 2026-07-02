import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse } from '@/types'

export interface PopularAuthor {
  id: number
  name: string
  bookCount: number
}

interface PopularAuthorsData {
  authors: PopularAuthor[]
}

export function usePopularAuthors() {
  return useQuery({
    queryKey: ['popular-authors'],
    queryFn: () =>
      apiFetch<ApiResponse<PopularAuthorsData>>('/api/authors/popular?limit=4'),
  })
}