import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ApiResponse } from '@/types'

export interface AdminUser {
  id: number
  name: string
  email: string
  phone: string
  profilePhoto: string | null
  role: 'ADMIN' | 'USER'
  createdAt: string
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface AdminUsersData {
  users: AdminUser[]
  pagination: PaginationMeta
}

export function useAdminUsers(page: number, q: string) {
  return useQuery({
    queryKey: ['admin-users', page, q],
    queryFn: () =>
      apiFetch<ApiResponse<AdminUsersData>>(
        `/api/admin/users?page=${page}&limit=10&q=${encodeURIComponent(q)}`
      ),
    placeholderData: (prev) => prev, // biar pindah halaman tidak berkedip kosong
  })
}