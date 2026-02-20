import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UIState, Notification, ToastType } from "./uiTypes"

const initialState: UIState = {
  modals: {},
  notifications: [],
  loading: {},
  theme: "light",
  toast: {
    show: false,
    message: "",
    type: "info",
  },
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleModal: (state, action: PayloadAction<string>) => {
      state.modals[action.payload] = !state.modals[action.payload]
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload)
    },
    setLoading: (
      state,
      action: PayloadAction<{ key: string; value: boolean }>
    ) => {
      state.loading[action.payload.key] = action.payload.value
    },
    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload
    },
    showToast: (
      state,
      action: PayloadAction<{ message: string; type: ToastType }>
    ) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type,
      }
    },
    hideToast: (state) => {
      state.toast.show = false
    },
  },
})

export const {
  toggleModal,
  addNotification,
  setLoading,
  setTheme,
  showToast,
  hideToast,
} = uiSlice.actions
export default uiSlice.reducer
