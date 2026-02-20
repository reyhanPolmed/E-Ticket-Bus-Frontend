import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  BookingState,
  Booking,
  Seat,
  Passenger,
  BookingStep,
} from "./bookingTypes";
import { logOut } from "../auth/AuthSlice";

// Load state from sessionStorage
const loadBookingState = (): BookingState => {
  try {
    const saved = sessionStorage.getItem("bookingState");
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load booking state from sessionStorage:", e);
  }
  return {
    currentBooking: null,
    selectedSeats: [],
    passengerData: [],
    bookingStep: "seats",
    bookingId: null,
  };
};

const initialState: BookingState = loadBookingState();

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
      // Clear sessionStorage on reset
      sessionStorage.removeItem("bookingState");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logOut, (state) => {
      // transform to initial state
      state.currentBooking = null;
      state.selectedSeats = [];
      state.passengerData = [];
      state.bookingStep = "seats";
      state.bookingId = null;
      sessionStorage.removeItem("bookingState");
    });
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
