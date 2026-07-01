import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../../types'

interface AuthState {
  token: string | null
  user: User | null
}

const initialState: AuthState = {
  token: localStorage.getItem('token'), // ambil token lama kalau ada
  user: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem('token', action.payload.token) // simpan biar tak hilang saat refresh
    },
    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer