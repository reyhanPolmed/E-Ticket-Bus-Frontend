import apiClient from "./apiClient";

export const getPaymentMethods = async () => {
    return apiClient.get("/payments/methods");
};

export const createPayment = async (payload: {
    bookingId: string;
    method: string;
    amount: number;
}) => {
    return apiClient.post("/payments", payload);
};