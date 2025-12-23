export interface Seat {
  seatNumber: string
  isAvailable: boolean
}

export interface Passenger {
  name: string
  age: number,
  seatNumber: string
}

export interface Booking {
  id: number
  scheduleId: number
  totalPrice: number
}

export type BookingStep = "seats" | "passengers" | "payment" | "confirmation"

export interface BookingState {
  currentBooking: Booking | null
  selectedSeats: Seat[]
  passengerData: Passenger[]
  bookingStep: BookingStep
}
