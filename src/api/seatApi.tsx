import apiClient from "./apiClient";

import type { SeatMapResponse } from "../features/booking/bookingTypes";

export const getBusSeats = async (scheduleId: string) => {
    return apiClient.get<SeatMapResponse>(`/seats/${scheduleId}`);
};