import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { UIState, Notification } from "./uiTypes"

const initialState: UIState = {
  modals: {},
  notifications: [],
  loading: {},
  theme: "light",
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
  },
})

export const { toggleModal, addNotification, setLoading, setTheme } =
  uiSlice.actions
export default uiSlice.reducer
