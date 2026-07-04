import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import { useAppDispatch } from '@/app/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import type { ApiResponse, User } from '@/types';

interface LoginData {
  token: string;
  user: User;
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [authError, setAuthError] = useState('');

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loginMutation = useMutation({
    mutationFn: (body: { email: string; password: string }) =>
      apiFetch<ApiResponse<LoginData>>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    onSuccess: (result) => {
      dispatch(
        setCredentials({ token: result.data.token, user: result.data.user })
      );
      if (result.data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    },
    onError: (error) => {
      setAuthError(error.message);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const nextEmailError = !email
      ? 'Email is required'
      : !email.includes('@')
        ? 'Invalid email address'
        : '';
    const nextPasswordError = !password
      ? 'Password is required'
      : password.length < 6
        ? 'Password must be at least 6 characters'
        : '';

    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);
    if (nextEmailError || nextPasswordError) return;

    loginMutation.mutate({ email, password });
  };

  const emailBorder =
    emailError || authError ? 'border-danger' : 'border-neutral-300';
  const passwordBorder =
    passwordError || authError ? 'border-danger' : 'border-neutral-300';

  return (
    <div className='flex min-h-screen items-center justify-center bg-white px-6'>
      <form
        onSubmit={handleSubmit}
        className='flex w-full max-w-[400px] flex-col gap-2xl tracking-[-0.02em]'
      >
        {/* Logo */}
        <div className='flex items-center gap-[11.79px]'>
          <img src='/logo.svg' alt='Booky' className='h-[33px] w-[33px]' />
          <span className='text-[25px] font-bold leading-[33px] text-neutral-950'>
            Booky
          </span>
        </div>

        {/* Judul + deskripsi */}
        <div className='flex flex-col gap-xxs md:gap-md'>
          <h1 className='text-display-xs font-bold text-neutral-950 md:text-display-sm'>
            Login
          </h1>
          <p className='text-body-sm font-semibold text-neutral-700 md:text-body-md'>
            Sign in to manage your library account.
          </p>
        </div>

        {/* Kolom-kolom */}
        <div className='flex flex-col gap-xl'>
          {/* Email */}
          <div className='flex flex-col gap-xxs'>
            <label
              htmlFor='email'
              className='text-body-sm font-bold text-neutral-950'
            >
              Email
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setEmailError('');
                setAuthError('');
              }}
              className={`h-12 rounded-xl border ${emailBorder} px-xl text-body-md font-semibold text-neutral-950 outline-none focus:border-primary-500`}
            />
            {emailError && (
              <p className='text-body-sm font-medium text-danger tracking-[-0.03em]'>
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div className='flex flex-col gap-xxs'>
            <label
              htmlFor='password'
              className='text-body-sm font-bold text-neutral-950'
            >
              Password
            </label>
            <div
              className={`flex h-12 items-center gap-md rounded-xl border ${passwordBorder} px-xl focus-within:border-primary-500`}
            >
              <input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                  setAuthError('');
                }}
                className='flex-1 text-body-md font-semibold text-neutral-950 outline-none'
              />
              <button
                type='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='text-neutral-950'
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && (
              <p className='text-body-sm font-medium text-danger tracking-[-0.03em]'>
                {passwordError}
              </p>
            )}
          </div>

          {authError && (
            <p className='text-center text-body-sm font-medium text-danger tracking-[-0.03em]'>
              {authError}
            </p>
          )}

          {/* Tombol */}
          <button
            type='submit'
            disabled={loginMutation.isPending}
            className='h-12 rounded-full bg-primary-500 text-body-md font-bold text-neutral-25 disabled:opacity-60'
          >
            {loginMutation.isPending ? 'Loading...' : 'Login'}
          </button>

          {/* Link Register */}
          <div className='flex items-center justify-center gap-xs'>
            <span className='text-body-sm font-semibold text-neutral-950 md:text-body-md'>
              Don&apos;t have an account?
            </span>
            <Link
              to='/register'
              className='text-body-sm font-bold text-primary-500 md:text-body-md'
            >
              Register
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginPage;
