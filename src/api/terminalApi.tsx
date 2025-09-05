export const getTerminals = async(token: string) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/terminals`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    })
}