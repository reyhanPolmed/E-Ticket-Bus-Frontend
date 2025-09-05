export const createPayment = async() => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/payments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    })
}

export const getPaymentMethods = async(token: string) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/payments/methods`,{
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Authorization': token
        }
    })
}

export const verifyPayment = async(token : string, paymentId: string) => {
    return await fetch(`${import.meta.env.VITE_API_PATH}/payments/${paymentId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token
        },
    })
}
