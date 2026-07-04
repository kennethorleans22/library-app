import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'

interface BorrowPayload {
  itemIds: number[]
  days: number
  borrowDate: string // format 'YYYY-MM-DD'
}

export function useBorrowFromCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BorrowPayload) =>
      apiFetch('/api/loans/from-cart', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    onSuccess: () => {
      // buku yang dipinjam otomatis hilang dari cart → badge navbar ikut berkurang
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}