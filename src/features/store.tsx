import { configureStore } from "@reduxjs/toolkit"

import authReducer from "../features/auth/AuthSlice"
import searchReducer from "../features/search/searchSlice"
import bookingReducer from "../features/booking/bookingSlice"
import paymentReducer from "../features/payment/paymentSlice"
import uiReducer from "../features/ui/uiSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    ui: uiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
