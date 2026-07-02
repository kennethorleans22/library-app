import { useInfiniteQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse } from '@/types'

export interface Review {
  id: number
  star: number
  comment: string
  createdAt: string
  user: { id: number; name: string }
}

interface ReviewsData {
  reviews: Review[]
  pagination: { page: number; limit: number; total: number; totalPages: number }
}

const LIMIT = 6

export function useBookReviews(bookId: number) {
  return useInfiniteQuery({
    queryKey: ['reviews', bookId],
    queryFn: ({ pageParam }) =>
      apiFetch<ApiResponse<ReviewsData>>(
        `/api/reviews/book/${bookId}?page=${pageParam}&limit=${LIMIT}`
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination
      return page < totalPages ? page + 1 : undefined
    },
  })
}