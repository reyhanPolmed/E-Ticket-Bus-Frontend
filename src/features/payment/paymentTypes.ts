export interface PaymentMethod {
  id: number
  name: string
  description: string
  fee: number
}

export interface Payment {
  id: number
  amount: number
  methodId: number
}

export type PaymentStatus = "idle" | "processing" | "success" | "failed"

export interface PaymentState {
  methods: PaymentMethod[]
  currentPayment: Payment | null
  status: PaymentStatus
}
