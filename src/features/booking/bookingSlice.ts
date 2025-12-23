import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type {
  BookingState,
  Booking,
  Seat,
  Passenger,
  BookingStep,
} from "./bookingTypes"

const initialState: BookingState = {
  currentBooking: null,
  selectedSeats: [],
  passengerData: [],
  bookingStep: "seats",
}

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<Booking>) => {
      state.currentBooking = action.payload
    },

    setSelectedSeats: (state, action: PayloadAction<Seat[]>) => {
      state.selectedSeats = action.payload
    },

    setPassengerData: (state, action: PayloadAction<Passenger[]>) => {
      state.passengerData = action.payload
    },

    setBookingStep: (state, action: PayloadAction<BookingStep>) => {
      state.bookingStep = action.payload
    },

    // (OPSIONAL, TAPI SANGAT DISARANKAN)
    resetBooking: (state) => {
      state.currentBooking = null
      state.selectedSeats = []
      state.passengerData = []
      state.bookingStep = "seats"
    },
  },
})

export const {
  setCurrentBooking,
  setSelectedSeats,
  setPassengerData,
  setBookingStep,
  resetBooking,
} = bookingSlice.actions

export default bookingSlice.reducer
