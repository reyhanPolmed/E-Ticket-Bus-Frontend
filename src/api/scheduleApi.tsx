import apiClient from "./apiClient";

export const searchSchedules = async ({
  date,
  origin,
  destination,
  passengers,
}: {
  date: string;
  origin: string;
  destination: string;
  passengers?: number;
}) => {
  return apiClient.get("/schedules/search", {
    params: { date, origin, destination, passengers },
  });
};

export const getScheduleById = async (id: string) => {
  return apiClient.get(`/schedules/${id}`);
};
