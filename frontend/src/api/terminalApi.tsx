export const getTerminals = async() => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/terminals`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        }
    })
}