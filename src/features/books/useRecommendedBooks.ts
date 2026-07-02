import { useInfiniteQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse, Book } from '@/types'

interface RecommendData {
  books: Book[]
}

const LIMIT = 10 // 10 buku per klik (desktop 5×2 baris, mobile 2×5 baris)

export function useRecommendedBooks() {
  return useInfiniteQuery({
    queryKey: ['recommended-books'],
    queryFn: ({ pageParam }) =>
      apiFetch<ApiResponse<RecommendData>>(
        `/api/books/recommend?page=${pageParam}&limit=${LIMIT}`
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Kalau halaman terakhir dapat < 10 buku, berarti sudah habis
      const lastCount = lastPage.data.books.length
      return lastCount < LIMIT ? undefined : allPages.length + 1
    },
  })
}