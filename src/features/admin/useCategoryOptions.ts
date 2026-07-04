import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse } from '@/types'

interface CategoriesData {
  categories: { id: number; name: string }[]
}

export function useCategoryOptions() {
  return useQuery({
    queryKey: ['category-options'],
    queryFn: () => apiFetch<ApiResponse<CategoriesData>>('/api/categories?limit=50'),
  })
}