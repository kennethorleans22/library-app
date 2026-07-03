import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse, Book } from '@/types'

interface AuthorBooksData {
  author: { id: number; name: string; bio: string }
  bookCount: number
  books: Book[]
}

export function useAuthorBooks(id: string | undefined) {
  return useQuery({
    queryKey: ['author-books', id],
    queryFn: () =>
      apiFetch<ApiResponse<AuthorBooksData>>(`/api/authors/${id}/books?page=1&limit=50`),
    enabled: !!id,
  })
}