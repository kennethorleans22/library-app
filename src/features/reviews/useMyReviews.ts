import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import { useAppSelector } from '@/app/hooks'
import type { ApiResponse, Book } from '@/types'

export interface MyReview {
  id: number
  star: number
  comment: string | null
  createdAt: string
  book: Book
}

interface MyReviewsData {
  reviews: MyReview[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface CreateReviewInput {
  bookId: number
  star: number
  comment: string
}

const LIMIT = 10

export function useMyReviews(search: string) {
  const token = useAppSelector((state) => state.auth.token)
  const keyword = search.trim()

  return useInfiniteQuery({
    queryKey: ['me', 'reviews', keyword],
    queryFn: ({ pageParam }) =>
      apiFetch<ApiResponse<MyReviewsData>>(
        `/api/me/reviews?page=${pageParam}&limit=${LIMIT}&q=${encodeURIComponent(keyword)}`,
      ),
    initialPageParam: 1,
    enabled: !!token,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination
      return page < totalPages ? page + 1 : undefined
    },
  })
}

export function useCreateReview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateReviewInput) =>
      apiFetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify(input),
      }),
    onSuccess: (_, input) => {
      queryClient.invalidateQueries({ queryKey: ['me', 'reviews'] })
      queryClient.invalidateQueries({ queryKey: ['reviews', input.bookId] })
    },
  })
}