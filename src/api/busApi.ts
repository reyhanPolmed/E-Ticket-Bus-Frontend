import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"

export const busApi = createApi({
  reducerPath: "busApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["Terminal", "Schedule", "Seat"],
  endpoints: (builder) => ({
    getTerminals: builder.query<any[], void>({
      query: () => "/terminals",
      providesTags: ["Terminal"],
    }),
    searchSchedules: builder.query<any[], { origin: string; destination: string; date: string }>({
      query: ({ origin, destination, date }) =>
        `/schedules/search?origin=${origin}&destination=${destination}&date=${date}`,
      providesTags: ["Schedule"],
    }),
    getScheduleById: builder.query<any, string>({
      query: (id) => `/schedules/${id}`,
      providesTags: ["Schedule"],
    }),
    getBusSeats: builder.query<any[], { busId: string; scheduleId: string }>({
      query: ({ busId, scheduleId }) => `/buses/${busId}/seats?scheduleId=${scheduleId}`,
      providesTags: ["Seat"],
    }),
  }),
})

export const { useGetTerminalsQuery, useSearchSchedulesQuery, useGetScheduleByIdQuery, useGetBusSeatsQuery } = busApi
