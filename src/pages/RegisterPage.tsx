import { Link } from 'react-router-dom'

function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-md">
      <h1 className="text-display-sm font-bold text-neutral-900">Halaman Register</h1>
      <Link to="/login" className="text-body-md font-bold text-primary-500">
        ← Ke Login
      </Link>
    </div>
  )
}

export default RegisterPage