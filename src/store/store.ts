import { configureStore } from "@reduxjs/toolkit"
import { busApi } from "../api/busApi"
import { bookingApi } from "../api/bookingApi"
import { paymentApi } from "../api/paymentApi"
import searchReducer from "./slices/searchSlice"
import bookingReducer from "./slices/bookingSlice"
import uiReducer from "./slices/uiSlice"

export const store = configureStore({
  reducer: {
    search: searchReducer,
    booking: bookingReducer,
    ui: uiReducer,
    [busApi.reducerPath]: busApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(busApi.middleware, bookingApi.middleware, paymentApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
