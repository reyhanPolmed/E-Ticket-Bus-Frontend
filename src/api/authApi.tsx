import apiClient from "./apiClient";

export const LoginUser = async (email: string, password: string) => {
    return apiClient.post("/auth/login", { email, password });
};

export const RegisterUser = async (
    email: string,
    firstName: string,
    lastName: string,
    password: string,
    phone: string
) => {
    return apiClient.post("/auth/register", {
        email,
        firstName,
        lastName,
        password,
        phone,
    });
};

export const getSession = async () => {
    return apiClient.get("/auth/session");
};

export const logoutUser = async () => {
    return apiClient.post("/auth/logout");
};