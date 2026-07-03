import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'

export function useAddToCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (bookId: number) =>
      apiFetch('/api/cart/items', {
        method: 'POST',
        body: JSON.stringify({ bookId }),
      }),
    onSuccess: () => {
      // Setelah tambah, muat ulang cart → badge navbar ikut update
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}