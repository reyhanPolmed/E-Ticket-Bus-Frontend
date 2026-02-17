import apiClient from "./apiClient";

export interface CreateBookingPayload {
  scheduleId: string;
  contactEmail: string;
  contactPhone: string;
  specialRequests?: string;
  passengers: {
    firstName: string;
    lastName: string;
    identityNumber: string;
    identityType: string;
    age: number;
    phone: string;
    email?: string;
    seatNumber: string;
    gender: string;
    nationality: string;
  }[];
}

export const createBooking = async (payload: CreateBookingPayload) => {
  return apiClient.post("/bookings", payload);
};

export const getMyBookings = async (status?: string) => {
  return apiClient.get("/bookings", {
    params: status ? { status } : {},
  });
};

export const getBookingDetails = async (id: string) => {
  return apiClient.get(`/bookings/${id}`);
};
