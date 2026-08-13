import apiClient from "./api-client";

export const getUnreadCount = () => {
    return apiClient.get("/notification/unread");
}

export const getNotifications = (page = 0, size = 10) => {
    return apiClient.get(`/notification?page=${page}&size=${size}`);
}

export const resetUnreadCount = () => {
    return apiClient.post("/notification/reset-unread");
}