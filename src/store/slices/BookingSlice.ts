import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface Passenger {
  id?: string
  name: string
  idNumber: string
  phone: string
  email?: string
  seatNumber: string
}

interface BookingState {
  currentStep: number
  selectedSchedule: any
  selectedSeats: string[]
  passengers: Passenger[]
  totalAmount: number
  bookingId?: string
  paymentMethod?: string
}

const initialState: BookingState = {
  currentStep: 1,
  selectedSchedule: null,
  selectedSeats: [],
  passengers: [],
  totalAmount: 0,
  bookingId: undefined,
  paymentMethod: undefined,
}

const bookingSlice = createSlice({
  name: "booking",
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    setSelectedSchedule: (state, action: PayloadAction<any>) => {
      state.selectedSchedule = action.payload
    },
    setSelectedSeats: (state, action: PayloadAction<string[]>) => {
      state.selectedSeats = action.payload
    },
    addSelectedSeat: (state, action: PayloadAction<string>) => {
      if (!state.selectedSeats.includes(action.payload)) {
        state.selectedSeats.push(action.payload)
      }
    },
    removeSelectedSeat: (state, action: PayloadAction<string>) => {
      state.selectedSeats = state.selectedSeats.filter((seat) => seat !== action.payload)
    },
    setPassengers: (state, action: PayloadAction<Passenger[]>) => {
      state.passengers = action.payload
    },
    setTotalAmount: (state, action: PayloadAction<number>) => {
      state.totalAmount = action.payload
    },
    setBookingId: (state, action: PayloadAction<string>) => {
      state.bookingId = action.payload
    },
    setPaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload
    },
    clearBooking: () => initialState,
  },
})

export const {
  setCurrentStep,
  setSelectedSchedule,
  setSelectedSeats,
  addSelectedSeat,
  removeSelectedSeat,
  setPassengers,
  setTotalAmount,
  setBookingId,
  setPaymentMethod,
  clearBooking,
} = bookingSlice.actions

export default bookingSlice.reducer
