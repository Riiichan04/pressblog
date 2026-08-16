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


export const markAsRead = async (notificationId: number) => {
    const response = await apiClient.put(`/notification/${notificationId}/read`);
    return response.data;
}

export const markAllAsRead = async () => {
    const response = await apiClient.put(`/notification/read-all`);
    return response.data;
}