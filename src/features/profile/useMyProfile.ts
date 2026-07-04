import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse, User } from '@/types'

export type MyProfileData = {
  profile: User & {
    createdAt?: string
  }
  loanStats: {
    borrowed: number
    late: number
    returned: number
    total: number
  }
  reviewsCount: number
}

type UpdateProfileInput = {
  name: string
  phone: string
  profilePhoto?: File | null
}

type UpdateProfileData = MyProfileData | User

export function getProfileFromUpdateResponse(data: UpdateProfileData) {
  if ('profile' in data) return data.profile
  return data
}

export function useMyProfile() {
  return useQuery({
    queryKey: ['me'],
    queryFn: () => apiFetch<ApiResponse<MyProfileData>>('/api/me'),
  })
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => {
      const formData = new FormData()

      formData.append('name', input.name)
      formData.append('phone', input.phone)

      if (input.profilePhoto) {
        formData.append('profilePhoto', input.profilePhoto)
      }

      return apiFetch<ApiResponse<UpdateProfileData>>('/api/me', {
        method: 'PATCH',
        body: formData,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] })
    },
  })
}