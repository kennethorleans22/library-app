import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../../types'

interface AuthState {
  token: string | null
  user: User | null
}

const storedUser = localStorage.getItem('user')

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: storedUser ? JSON.parse(storedUser) : null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token
      state.user = action.payload.user
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (!state.user) return

      state.user = {
        ...state.user,
        ...action.payload,
      }

      localStorage.setItem('user', JSON.stringify(state.user))
    },

    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
  },
})

export const { setCredentials, updateUser, logout } = authSlice.actions
export default authSlice.reducer