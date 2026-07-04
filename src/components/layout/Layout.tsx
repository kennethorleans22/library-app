import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

// Halaman yang TIDAK pakai footer
const HIDE_FOOTER_PATHS = ['/borrow-success']

function Layout() {
  const location = useLocation()
  const hideFooter = HIDE_FOOTER_PATHS.includes(location.pathname)

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </div>
  )
}

export default Layout