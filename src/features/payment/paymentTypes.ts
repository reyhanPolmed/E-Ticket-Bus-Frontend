export interface PaymentMethod {
  id: string;
  name: string;
}

export interface Payment {
  id: string;
  amount: number;
  method: string;
  bookingId: string;
  status?: string;
}

export type PaymentStatus = "idle" | "processing" | "success" | "failed";

export interface PaymentState {
  methods: PaymentMethod[];
  currentPayment: Payment | null;
  status: PaymentStatus;
}
