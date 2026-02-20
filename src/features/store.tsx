import { configureStore } from "@reduxjs/toolkit"

import authReducer from "../features/auth/AuthSlice"
import searchReducer from "../features/search/searchSlice"
import bookingReducer from "../features/booking/bookingSlice"
import paymentReducer from "../features/payment/paymentSlice"
import uiReducer from "../features/ui/uiSlice"

// Load persisted state from sessionStorage
const loadState = () => {
  try {
    const serializedBooking = sessionStorage.getItem("bookingState");
    const serializedSearch = sessionStorage.getItem("searchState");
    const serializedAuth = sessionStorage.getItem("authState"); // Add auth

    return {
      booking: serializedBooking ? JSON.parse(serializedBooking) : undefined,
      search: serializedSearch ? JSON.parse(serializedSearch) : undefined,
      auth: serializedAuth ? JSON.parse(serializedAuth) : undefined, // Add auth
    };
  } catch (err) {
    return undefined;
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    search: searchReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    ui: uiReducer,
  },
  preloadedState, // Inject preloaded state
})

// Persist auth, booking and search state to sessionStorage on every state change
store.subscribe(() => {
  const state = store.getState();
  try {
    sessionStorage.setItem("bookingState", JSON.stringify(state.booking));
    sessionStorage.setItem("searchState", JSON.stringify(state.search));
    sessionStorage.setItem("authState", JSON.stringify(state.auth)); // Save auth
  } catch (e) {
    console.error("Failed to save state to sessionStorage:", e);
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
