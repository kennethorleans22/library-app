import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse, Category } from '@/types'

interface CategoriesData {
  categories: Category[]
}

// Hanya 6 kategori "bersih" ini yang dipakai (sisanya kotoran dari backend)
export const CATEGORY_NAMES = [
  'Fiction',
  'Non-Fiction',
  'Self-Improvement',
  'Finance',
  'Science',
  'Education',
] as const

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => apiFetch<ApiResponse<CategoriesData>>('/api/categories'),
    select: (res): Category[] =>
      CATEGORY_NAMES.map((name) =>
        res.data.categories.find((c) => c.name === name)
      ).filter((c): c is Category => Boolean(c)),
    staleTime: 1000 * 60 * 60,
  })
}