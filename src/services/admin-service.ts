import { AdminDashboardResponse } from "@/common/types/admin";
import apiClient from "./api-client";

export const getAdminStats = async (): Promise<AdminDashboardResponse> => {
    const response = await apiClient.get<AdminDashboardResponse>("/admin/dashboard/stats");
    return response.data;
};