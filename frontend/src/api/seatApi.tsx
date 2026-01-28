export const getBusSeats = async(token: string, scheduleId: string) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/seats/${scheduleId}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    })
}