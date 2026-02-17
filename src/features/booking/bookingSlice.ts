import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  BookingState,
  Booking,
  Seat,
  Passenger,
  BookingStep,
} from "./bookingTypes";

const initialState: BookingState = {
  currentBooking: null,
  selectedSeats: [],
  passengerData: [],
  bookingStep: "seats",
  bookingId: null,
};

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setCurrentBooking: (state, action: PayloadAction<Booking>) => {
      state.currentBooking = action.payload;
    },

    setSelectedSeats: (state, action: PayloadAction<Seat[]>) => {
      state.selectedSeats = action.payload;
    },

    setPassengerData: (state, action: PayloadAction<Passenger[]>) => {
      state.passengerData = action.payload;
    },

    setBookingStep: (state, action: PayloadAction<BookingStep>) => {
      state.bookingStep = action.payload;
    },

    setBookingId: (state, action: PayloadAction<string>) => {
      state.bookingId = action.payload;
    },

    resetBooking: (state) => {
      state.currentBooking = null;
      state.selectedSeats = [];
      state.passengerData = [];
      state.bookingStep = "seats";
      state.bookingId = null;
    },
  },
});

export const {
  setCurrentBooking,
  setSelectedSeats,
  setPassengerData,
  setBookingStep,
  setBookingId,
  resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
