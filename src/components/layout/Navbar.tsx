import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { logout } from '@/features/auth/authSlice'
import { setSearch } from '@/features/ui/uiSlice'
import { useCart } from '@/features/cart/useCart'

const accountMenu = [
  { label: 'Profile', to: '/profile' },
  { label: 'Borrowed List', to: '/loans' },
  { label: 'Reviews', to: '/reviews' },
]

function Navbar() {
  const token = useAppSelector((state) => state.auth.token)
  const user = useAppSelector((state) => state.auth.user)
  const search = useAppSelector((state) => state.ui.search)
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
    <header className="sticky top-0 z-50 bg-white shadow-card">
      <div className="relative mx-auto flex h-16 max-w-300 items-center justify-between gap-xl px-4 lg:h-20 lg:px-8">
        {searchOpen ? (
          <>
            <Link to="/" className="shrink-0">
              <img src="/logo.svg" alt="Booky" className="size-10" />
            </Link>

            <div className="flex h-10 flex-1 items-center gap-1.5 rounded-full border border-neutral-300 px-lg">
              <img src="/icons/search.svg" alt="" className="size-5" />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(event) => dispatch(setSearch(event.target.value))}
                placeholder="Search book"
                className="min-w-0 flex-1 text-body-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-600"
              />
            </div>

            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="shrink-0"
            >
              <img src="/icons/close.svg" alt="Close" className="size-6" />
            </button>
          </>
        ) : (
          <>
            <Link to="/" className="flex items-center gap-md">
              <img src="/logo.svg" alt="Booky" className="size-10 lg:size-10.5" />
              <span className="hidden text-display-md font-bold text-neutral-950 lg:block">
                Booky
              </span>
            </Link>

            {isLoggedIn && (
              <div className="hidden h-11 w-125 items-center gap-1.5 rounded-full border border-neutral-300 px-xl lg:flex">
                <img src="/icons/search.svg" alt="" className="size-5" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => dispatch(setSearch(event.target.value))}
                  placeholder="Search book"
                  className="min-w-0 flex-1 text-body-sm font-medium text-neutral-950 outline-none placeholder:text-neutral-600"
                />
              </div>
            )}

            {isLoggedIn ? (
              <div className="flex items-center gap-xl lg:gap-3xl">
                <button
                  type="button"
                  className="lg:hidden"
                  onClick={() => setSearchOpen(true)}
                >
                  <img src="/icons/search.svg" alt="Search" className="size-6" />
                </button>

                <Link to="/cart" className="relative">
                  <img src="/icons/cart.svg" alt="Cart" className="size-7 lg:size-8" />
                  {cartCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-danger text-body-xs font-bold text-white">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                    className="flex items-center gap-md"
                  >
                    <img
                      src={user?.profilePhoto || '/avatar-placeholder.png'}
                      alt={user?.name || 'Profile'}
                      className="size-10 rounded-full object-cover lg:size-12"
                    />
                    <span className="hidden text-body-lg font-semibold text-neutral-950 lg:block">
                      {user?.name}
                    </span>
                    <img
                      src="/icons/chevron-down.svg"
                      alt=""
                      className="hidden size-6 lg:block"
                    />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-14.5 hidden h-50 w-46 flex-col items-start gap-4 rounded-2xl bg-white p-4 shadow-card lg:flex">
                      {accountMenu.map((item) => (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setMenuOpen(false)}
                          className="h-7.5 w-full text-body-md font-semibold tracking-figma-tight text-neutral-950"
                        >
                          {item.label}
                        </Link>
                      ))}

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="h-7.5 w-full text-left text-body-md font-semibold tracking-figma-tight text-danger"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-xl lg:hidden">
                  <button type="button" onClick={() => setSearchOpen(true)}>
                    <img src="/icons/search.svg" alt="Search" className="size-6" />
                  </button>

                  <Link to="/cart" className="relative">
                    <img src="/icons/cart.svg" alt="Cart" className="size-7" />
                    {cartCount > 0 && (
                      <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-danger text-body-xs font-bold text-white">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <button
                    type="button"
                    onClick={() => setMenuOpen((open) => !open)}
                  >
                    <img src="/icons/menu.svg" alt="Menu" className="size-6" />
                  </button>
                </div>

                <div className="hidden items-center gap-xl lg:flex">
                  <Link
                    to="/login"
                    className="flex h-12 w-40.75 items-center justify-center rounded-full border border-neutral-300 text-body-md font-bold text-neutral-950"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex h-12 w-40.75 items-center justify-center rounded-full bg-primary-500 text-body-md font-bold text-neutral-25"
                  >
                    Register
                  </Link>
                </div>
              </>
            )}
          </>
        )}
      </div>

      {menuOpen && isLoggedIn && !searchOpen && (
        <div className="mx-auto flex h-50 w-90.25 flex-col items-start gap-4 rounded-2xl bg-white p-4 shadow-card lg:hidden">
          {accountMenu.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setMenuOpen(false)}
              className="h-7.5 w-full text-body-sm font-semibold tracking-figma-tight text-neutral-950"
            >
              {item.label}
            </Link>
          ))}

          <button
            type="button"
            onClick={handleLogout}
            className="h-7.5 w-full text-left text-body-sm font-semibold tracking-figma-tight text-danger"
          >
            Logout
          </button>
        </div>
      )}

      {menuOpen && !isLoggedIn && !searchOpen && (
        <div className="mx-auto flex h-18 w-full max-w-98.25 flex-col bg-white p-4 lg:hidden">
          <div className="flex h-10 w-full items-center gap-3">
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 flex-1 items-center justify-center rounded-full border border-neutral-300 text-body-sm font-bold tracking-figma-tight text-neutral-950"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 flex-1 items-center justify-center rounded-full bg-primary-500 text-body-sm font-bold tracking-figma-tight text-neutral-25"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar