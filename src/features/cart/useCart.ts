import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import { useAppSelector } from '@/app/hooks'
import type { ApiResponse, Book } from '@/types'

export interface CartItem {
  id: number
  bookId: number
  addedAt: string
  book: Book
}

interface CartData {
  cartId: number
  items: CartItem[]
}

export function useCart() {
  const token = useAppSelector((state) => state.auth.token)
  return useQuery({
    queryKey: ['cart'],
    queryFn: () => apiFetch<ApiResponse<CartData>>('/api/cart'),
    enabled: !!token, // cuma ambil kalau sudah login
  })
}