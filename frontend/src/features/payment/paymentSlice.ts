import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { PaymentState, Payment, PaymentMethod, PaymentStatus } from "./paymentTypes"

const initialState: PaymentState = {
  methods: [
    {
      id: 1,
      name: "TRANSFER BANK",
      description: "BCA, Mandiri, BNI, BRI",
      fee: 0,
    },
    {
      id: 2,
      name: "E-WALLET",
      description: "GoPay, OVO, Dana",
      fee: 2500,
    },
  ],
  currentPayment: null,
  status: "idle",
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
      state.methods = action.payload
    },
    setCurrentPayment: (state, action: PayloadAction<Payment | null>) => {
      state.currentPayment = action.payload
    },
    setPaymentStatus: (state, action: PayloadAction<PaymentStatus>) => {
      state.status = action.payload
    },
  },
})

export const { setPaymentMethods, setCurrentPayment, setPaymentStatus } =
  paymentSlice.actions
export default paymentSlice.reducer
