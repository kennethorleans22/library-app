import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { setSearch } from '@/features/ui/uiSlice'
import { useCart } from '@/features/cart/useCart'

function Navbar() {
  const token = useAppSelector((s) => s.auth.token)
  const user = useAppSelector((s) => s.auth.user)
  const search = useAppSelector((s) => s.ui.search)
  const isLoggedIn = !!token

  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const { data: cartData } = useCart()
  const cartCount = cartData?.data.items.length ?? 0

  const handleLogout = () => {
    dispatch(logout())
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-[0px_0px_20px_rgba(203,202,202,0.25)]">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-xl px-4 md:h-20 lg:px-8">

        {/* ===== MODE: search terbuka (mobile) ===== */}
        {searchOpen ? (
          <>
            <Link to="/" className="shrink-0">
              <img src="/logo.svg" alt="Booky" className="h-10 w-10" />
            </Link>
            <div className="flex h-10 flex-1 items-center gap-1.5 rounded-full border border-neutral-300 px-lg">
              <img src="/icons/search.svg" alt="" className="h-5 w-5" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => dispatch(setSearch(e.target.value))}
                placeholder="Search book"
                className="flex-1 text-body-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-600"
              />
            </div>
            <button onClick={() => setSearchOpen(false)} className="shrink-0">
              <img src="/icons/close.svg" alt="Close" className="h-6 w-6" />
            </button>
          </>
        ) : (
          <>
            {/* ===== Logo ===== */}
            <Link to="/" className="flex items-center gap-md">
              <img src="/logo.svg" alt="Booky" className="h-10 w-10 md:h-[42px] md:w-[42px]" />
              <span className="hidden text-display-md font-bold text-neutral-950 md:block">
                Booky
              </span>
            </Link>

            {/* ===== Search bar inline (desktop, saat login) ===== */}
            {isLoggedIn && (
              <div className="hidden h-11 w-[500px] items-center gap-1.5 rounded-full border border-neutral-300 px-xl md:flex">
                <img src="/icons/search.svg" alt="" className="h-5 w-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => dispatch(setSearch(e.target.value))}
                  placeholder="Search book"
                  className="flex-1 text-body-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-600"
                />
              </div>
            )}

            {/* ===== Sisi kanan ===== */}
            {isLoggedIn ? (
              <div className="flex items-center gap-xl md:gap-3xl">
                <button className="md:hidden" onClick={() => setSearchOpen(true)}>
                  <img src="/icons/search.svg" alt="Search" className="h-6 w-6" />
                </button>

                             <Link to="/cart" className="relative">
                  <img src="/icons/cart.svg" alt="Cart" className="h-7 w-7 md:h-8 md:w-8" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-body-xs font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button onClick={() => setMenuOpen((o) => !o)} className="flex items-center gap-md">
                    <img
                      src={user?.profilePhoto}
                      alt={user?.name}
                      className="h-10 w-10 rounded-full object-cover md:h-12 md:w-12"
                    />
                    <span className="hidden text-body-lg font-semibold text-neutral-950 md:block">
                      {user?.name}
                    </span>
                    <img src="/icons/chevron-down.svg" alt="" className="hidden h-6 w-6 md:block" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-md w-44 overflow-hidden rounded-xl border border-neutral-200 bg-white py-xs shadow-lg">
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="block px-lg py-md text-body-sm font-medium text-neutral-900 hover:bg-neutral-50"
                      >
                        My Profile
                      </Link>
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
            ) : (
              <>
                {/* Belum login — MOBILE */}
               <div className="flex items-center gap-xl lg:hidden">
                  <button onClick={() => setSearchOpen(true)}>
                    <img src="/icons/search.svg" alt="Search" className="h-6 w-6" />
                  </button>
                  <button className="relative">
                    <img src="/icons/cart.svg" alt="Cart" className="h-7 w-7" />
                    {cartCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-body-xs font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <button onClick={() => setMenuOpen((o) => !o)}>
                    <img src="/icons/menu.svg" alt="Menu" className="h-6 w-6" />
                  </button>
                </div>

                {/* Belum login — DESKTOP */}
              <div className="hidden items-center gap-xl lg:flex">
                  <Link
                    to="/login"
                    className="flex h-12 w-[163px] items-center justify-center rounded-full border border-neutral-300 text-body-md font-bold text-neutral-950"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex h-12 w-[163px] items-center justify-center rounded-full bg-primary-500 text-body-md font-bold text-neutral-25"
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Menu hamburger (mobile, belum login) */}
      {menuOpen && !isLoggedIn && (
    <div className="flex flex-col gap-md border-t border-neutral-200 px-4 py-lg lg:hidden">
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="flex h-12 items-center justify-center rounded-full border border-neutral-300 text-body-md font-bold text-neutral-950"
          >
            Login
          </Link>
          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="flex h-12 items-center justify-center rounded-full bg-primary-500 text-body-md font-bold text-neutral-25"
          >
            Register
          </Link>
        </div>
      )}
    </header>
  )
}

export default Navbar