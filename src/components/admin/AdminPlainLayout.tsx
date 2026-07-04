import { Outlet } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'

function AdminPlainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AdminNavbar />
      <main className="mx-auto w-full max-w-300 px-4 pb-16 pt-6 lg:px-8 lg:pt-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminPlainLayout