import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'

export function useUpdateBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
      apiFetch(`/api/books/${id}`, { method: 'PUT', body: formData }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-books'] })
    },
  })
}