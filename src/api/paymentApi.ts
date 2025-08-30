import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001/api"

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["Payment"],
  endpoints: (builder) => ({
    createPayment: builder.mutation<any, any>({
      query: (paymentData) => ({
        url: "/payments",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payment"],
    }),
    getPaymentMethods: builder.query<any[], void>({
      query: () => "/payments/methods",
    }),
    verifyPayment: builder.mutation<any, { paymentId: string; verificationData: any }>({
      query: ({ paymentId, verificationData }) => ({
        url: `/payments/${paymentId}/verify`,
        method: "POST",
        body: verificationData,
      }),
      invalidatesTags: ["Payment"],
    }),
  }),
})

export const { useCreatePaymentMutation, useGetPaymentMethodsQuery, useVerifyPaymentMutation } = paymentApi
