import { DashboardStatResponse } from "@/common/types/dashboard";
import apiClient from "./api-client";
import { apiUrl } from "@/common/constants/api-url";


export const getDashboardStats = async (): Promise<DashboardStatResponse> => {
    const response = await apiClient<DashboardStatResponse>(`${apiUrl}/user/dashboard/stats`, {
        method: "GET",
    });
    
    if (response.status !== 200 || !response.data) {
        throw new Error("Failed to get data");
    }
    return response.data
};