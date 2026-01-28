export const searchSchedules = async (
  // token: string,
  {
    date,
    origin,
    destination,
  }: {
    date: string;
    origin: string;
    destination: string;
  }
) => {
  return await fetch(
    `${
      import.meta.env.VITE_API_PATH
    }/schedules/search?date=${date}&origin=${origin}&destination=${destination}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        // Authorization: token,
      },
    }
  );
};

export const getScheduleById = async (token: string, id: string) => {
  return await fetch(`${import.meta.env.VITE_API_PATH}/schedules/${id}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};
