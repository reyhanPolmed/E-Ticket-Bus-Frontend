import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"

export const bookingApi = createApi({
  reducerPath: "bookingApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["Booking"],
  endpoints: (builder) => ({
    createBooking: builder.mutation<any, any>({
      query: (bookingData) => ({
        url: "/bookings",
        method: "POST",
        body: bookingData,
      }),
      invalidatesTags: ["Booking"],
    }),
    getBookingById: builder.query<any, string>({
      query: (id) => `/bookings/${id}`,
      providesTags: ["Booking"],
    }),
    updateBookingStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/bookings/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
})

export const { useCreateBookingMutation, useGetBookingByIdQuery, useUpdateBookingStatusMutation } = bookingApi
