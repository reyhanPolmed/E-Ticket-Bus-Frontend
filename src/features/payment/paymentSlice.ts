import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  PaymentState,
  Payment,
  PaymentMethod,
  PaymentStatus,
} from "./paymentTypes";

const initialState: PaymentState = {
  methods: [],
  currentPayment: null,
  status: "idle",
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentMethods: (state, action: PayloadAction<PaymentMethod[]>) => {
      state.methods = action.payload;
    },
    setCurrentPayment: (state, action: PayloadAction<Payment | null>) => {
      state.currentPayment = action.payload;
    },
    setPaymentStatus: (state, action: PayloadAction<PaymentStatus>) => {
      state.status = action.payload;
    },
  },
});

export const { setPaymentMethods, setCurrentPayment, setPaymentStatus } =
  paymentSlice.actions;
export default paymentSlice.reducer;
