import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  search: string
  categoryId: number | null
}

const initialState: UiState = {
  search: '',
  categoryId: null,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload
    },
    setCategoryId: (state, action: PayloadAction<number | null>) => {
      state.categoryId = action.payload
    },
  },
})

export const { setSearch, setCategoryId } = uiSlice.actions
export default uiSlice.reducer