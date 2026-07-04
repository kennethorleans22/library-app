import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'

export function useCreateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (formData: FormData) =>
      apiFetch('/api/books', { method: 'POST', body: formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] })
    },
  })
}