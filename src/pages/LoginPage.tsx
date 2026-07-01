import { Link } from 'react-router-dom'

function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-md">
      <h1 className="text-display-sm font-bold text-neutral-900">Halaman Login</h1>
      <Link to="/" className="text-body-md font-bold text-primary-500">
        ← Ke Daftar Buku
      </Link>
    </div>
  )
}

export default LoginPage