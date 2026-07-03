import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'

export function useBorrowFromCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (itemIds: number[]) =>
      apiFetch('/api/loans/from-cart', {
        method: 'POST',
        body: JSON.stringify({ itemIds, days: 3 }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}