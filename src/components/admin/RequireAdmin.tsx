import type { ReactElement } from 'react'
import { Navigate } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

function RequireAdmin({ children }: { children: ReactElement }) {
  const token = useAppSelector((s) => s.auth.token)
  const user = useAppSelector((s) => s.auth.user)

  if (!token) return <Navigate to="/login" replace />
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />
  return children
}

export default RequireAdmin