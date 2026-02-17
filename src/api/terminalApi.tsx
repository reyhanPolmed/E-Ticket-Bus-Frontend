import apiClient from "./apiClient";

export const getTerminals = async () => {
    return apiClient.get("/terminals");
};

export const searchTerminals = async (query: string) => {
    return apiClient.get(`/terminals/terminal`, { params: { q: query } });
};