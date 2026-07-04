import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'

function AdminNavbar() {
  const user = useAppSelector((s) => s.auth.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
      <div className="mx-auto flex h-16 max-w-300 items-center justify-between px-4 md:h-20 lg:px-8">
        <Link to="/admin" className="flex items-center gap-md">
          <img src="/logo.svg" alt="Booky" className="h-10 w-10" />
          <span className="hidden text-display-md font-bold text-neutral-950 md:block">Booky</span>
        </Link>

        <div className="relative">
          <button onClick={() => setOpen((o) => !o)} className="flex items-center gap-md">
            <img
              src={user?.profilePhoto || '/avatar-placeholder.png'}
              alt={user?.name}
              className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
            />
            <span className="hidden text-body-lg font-semibold text-neutral-950 md:block">{user?.name}</span>
            <img src="/icons/chevron-down.svg" alt="" className="hidden h-6 w-6 md:block" />
          </button>

          {open && (
            <div className="absolute right-0 mt-md w-44 overflow-hidden rounded-xl border border-neutral-200 bg-white py-xs shadow-lg">
              <button
                onClick={handleLogout}
                className="block w-full px-lg py-md text-left text-body-sm font-medium text-danger hover:bg-neutral-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default AdminNavbar