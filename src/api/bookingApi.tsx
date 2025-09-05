export const createBooking = async (token : string, scheduleId : string, passengers: string, contactEmail: string, contactPhone: string, specialRequests: string) => {
  return await fetch(`${import.meta.env.VITE_API_PATH}/bookings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      'Accept': "application/json",
      'Authorization': token
    },
    body: JSON.stringify({
        scheduleId,
        passengers,
        contactEmail,
        contactPhone,
        specialRequests
    }),
  });
};

export const getBookingById = async (token : string) => {
  return await fetch(`${import.meta.env.VITE_API_PATH}/bookings`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

export const updateBookingStatus = async (id: string, status: string) => {
  return await fetch(`${import.meta.env.VITE_API_PATH}/bookings/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
        status
    }),
  });
};
