import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface UiState {
  isMobile: boolean
  isLoading: boolean
  error: string | null
  notification: {
    message: string
    type: "success" | "error" | "info"
  } | null
}

const initialState: UiState = {
  isMobile: window.innerWidth <= 768,
  isLoading: false,
  error: null,
  notification: null,
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    setNotification: (state, action: PayloadAction<UiState["notification"]>) => {
      state.notification = action.payload
    },
    clearNotification: (state) => {
      state.notification = null
    },
  },
})

export const { setIsMobile, setLoading, setError, setNotification, clearNotification } = uiSlice.actions

export default uiSlice.reducer
