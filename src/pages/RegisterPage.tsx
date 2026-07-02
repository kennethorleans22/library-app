import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { apiFetch } from '@/lib/api'
import { useAppDispatch } from '@/app/hooks'
import { setCredentials } from '@/features/auth/authSlice'
import type { ApiResponse, User } from '@/types'

interface RegisterData {
  token?: string
  user?: User
}

interface RegisterBody {
  name: string
  email: string
  password: string
  phone?: string
}

function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmError, setConfirmError] = useState('')

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const registerMutation = useMutation({
    mutationFn: (body: RegisterBody) =>
      apiFetch<ApiResponse<RegisterData>>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: (result) => {
      // Sebagian server langsung kasih token saat register → langsung login.
      // Kalau tidak, arahkan ke halaman Login.
      if (result.data?.token && result.data?.user) {
        dispatch(setCredentials({ token: result.data.token, user: result.data.user }))
        navigate('/')
      } else {
        navigate('/login')
      }
    },
    onError: (error) => {
      // Untuk register, "email sudah terdaftar" boleh ditampilkan → taruh di kolom email.
      setEmailError(error.message)
    },
  })

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const nextNameError = !name ? 'Name is required' : ''
    const nextEmailError = !email
      ? 'Email is required'
      : !email.includes('@')
        ? 'Invalid email address'
        : ''
    const nextPasswordError = !password
      ? 'Password is required'
      : password.length < 6
        ? 'Password must be at least 6 characters'
        : ''
    const nextConfirmError = !confirmPassword
      ? 'Please confirm your password'
      : confirmPassword !== password
        ? 'Passwords do not match'
        : ''

    setNameError(nextNameError)
    setEmailError(nextEmailError)
    setPasswordError(nextPasswordError)
    setConfirmError(nextConfirmError)

    if (nextNameError || nextEmailError || nextPasswordError || nextConfirmError) return

    registerMutation.mutate({
      name,
      email,
      password,
      phone: phone || undefined,
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-9xl">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-[400px] flex-col gap-2xl tracking-[-0.02em]"
      >
        {/* Logo */}
        <div className="flex items-center gap-[11.79px]">
          <img src="/logo.svg" alt="Booky" className="h-[33px] w-[33px]" />
          <span className="text-[25px] font-bold leading-[33px] text-neutral-950">
            Booky
          </span>
        </div>

        {/* Judul + deskripsi */}
        <div className="flex flex-col gap-xxs md:gap-md">
          <h1 className="text-display-xs font-bold text-neutral-950 md:text-display-sm">
            Register
          </h1>
          <p className="text-body-sm font-semibold text-neutral-700 md:text-body-md">
            Create your account to start borrowing books.
          </p>
        </div>

        {/* Kolom-kolom */}
        <div className="flex flex-col gap-xl">
          {/* Name */}
          <div className="flex flex-col gap-xxs">
            <label htmlFor="name" className="text-body-sm font-bold text-neutral-950">
              Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setNameError('')
              }}
              className={`h-12 rounded-xl border ${nameError ? 'border-danger' : 'border-neutral-300'} px-xl text-body-md font-semibold text-neutral-950 outline-none focus:border-primary-500`}
            />
            {nameError && (
              <p className="text-body-sm font-medium text-danger tracking-[-0.03em]">
                {nameError}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-xxs">
            <label htmlFor="email" className="text-body-sm font-bold text-neutral-950">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError('')
              }}
              className={`h-12 rounded-xl border ${emailError ? 'border-danger' : 'border-neutral-300'} px-xl text-body-md font-semibold text-neutral-950 outline-none focus:border-primary-500`}
            />
            {emailError && (
              <p className="text-body-sm font-medium text-danger tracking-[-0.03em]">
                {emailError}
              </p>
            )}
          </div>

          {/* Nomor Handphone */}
          <div className="flex flex-col gap-xxs">
            <label htmlFor="phone" className="text-body-sm font-bold text-neutral-950">
              Nomor Handphone
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-12 rounded-xl border border-neutral-300 px-xl text-body-md font-semibold text-neutral-950 outline-none focus:border-primary-500"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-xxs">
            <label htmlFor="password" className="text-body-sm font-bold text-neutral-950">
              Password
            </label>
            <div className={`flex h-12 items-center gap-md rounded-xl border ${passwordError ? 'border-danger' : 'border-neutral-300'} px-xl focus-within:border-primary-500`}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError('')
                }}
                className="flex-1 text-body-md font-semibold text-neutral-950 outline-none"
              />
              <button type="button" onClick={() => setShowPassword((p) => !p)} className="text-neutral-950">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-body-sm font-medium text-danger tracking-[-0.03em]">
                {passwordError}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-xxs">
            <label htmlFor="confirmPassword" className="text-body-sm font-bold text-neutral-950">
              Confirm Password
            </label>
            <div className={`flex h-12 items-center gap-md rounded-xl border ${confirmError ? 'border-danger' : 'border-neutral-300'} px-xl focus-within:border-primary-500`}>
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setConfirmError('')
                }}
                className="flex-1 text-body-md font-semibold text-neutral-950 outline-none"
              />
              <button type="button" onClick={() => setShowConfirm((p) => !p)} className="text-neutral-950">
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmError && (
              <p className="text-body-sm font-medium text-danger tracking-[-0.03em]">
                {confirmError}
              </p>
            )}
          </div>

          {/* Tombol */}
          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="h-12 rounded-full bg-primary-500 text-body-md font-bold text-neutral-25 disabled:opacity-60"
          >
            {registerMutation.isPending ? 'Loading...' : 'Submit'}
          </button>

          {/* Link ke Login */}
          <div className="flex items-center justify-center gap-xs">
            <span className="text-body-sm font-semibold text-neutral-950 md:text-body-md">
              Already have an account?
            </span>
            <Link to="/login" className="text-body-sm font-bold text-primary-500 md:text-body-md">
              Log In
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default RegisterPage