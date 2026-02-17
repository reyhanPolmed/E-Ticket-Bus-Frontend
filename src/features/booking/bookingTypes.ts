import type { Schedule } from "../search/searchTypes";

export interface Seat {
  seatNumber: string;
  row: number;
  position: number;
  isAvailable: boolean;
  price: string;
  seatType: string;
}

export interface SeatMapResponse {
  success: boolean;
  data: {
    schedule: {
      id: string;
      scheduleCode: string;
      totalSeats: number;
      availableSeats: number;
    };
    bus: {
      id: string;
      busNumber: string;
      busType: string;
    };
    seatConfiguration: {
      rows: number;
      layout: string;
      seatsPerRow: number;
    };
    seats: Seat[];
  };
}

export interface Passenger {
  firstName: string;
  lastName: string;
  identityType: "KTP" | "PASSPORT" | "SIM";
  identityNumber: string;
  seatNumber: string;
  age: number;
  phone: string;
  gender: "male" | "female";
  nationality: string;
  email?: string;
}

export interface BookingDetail {
  id: string;
  bookingId: string;
  seatNumber: string;
  passengerName: string;
  passengerPhone: string;
  passengerEmail?: string;
  passengerIdType: string;
  passengerIdNumber: string;
  price: string;
  status: string;
}

export interface Booking {
  id: string;
  bookingCode?: string;
  userId?: string;
  scheduleId: string;
  totalPassengers?: number;
  totalPrice: string;
  status?: string;
  paymentStatus?: string;
  bookingDate?: string;
  expiryDate?: string;
  contactEmail?: string;
  contactPhone?: string;
  specialRequests?: string;
  cancellationReason?: string;
  refundAmount?: string;
  schedule?: Schedule;
  bookingDetails?: BookingDetail[];
  createdAt?: string;
  updatedAt?: string;
}

export type BookingStep = "seats" | "passengers" | "payment" | "confirmation";

export interface BookingState {
  currentBooking: Booking | null;
  selectedSeats: Seat[];
  passengerData: Passenger[];
  bookingStep: BookingStep;
  bookingId: string | null;
}
