import { Outlet } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'
import AdminTabs from './AdminTabs'

function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AdminNavbar />
      <main className="mx-auto flex w-full max-w-300 flex-col gap-4 px-4 pb-16 pt-6 lg:gap-7.5 lg:px-8 lg:pt-8">
        <AdminTabs />
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout