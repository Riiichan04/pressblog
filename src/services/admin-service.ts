import { AdminDashboardResponse, AdminPostResponse } from "@/common/types/admin";
import apiClient from "./api-client";
import { PostStatus } from "@/common/types/post";
import { PageResponse } from "@/common/types/page-response";

export const getAdminStats = async (): Promise<AdminDashboardResponse> => {
    const response = await apiClient.get<AdminDashboardResponse>("/admin/dashboard/stats");
    return response.data;
};

export const updatePostStatus = async (postId: number, status: PostStatus): Promise<string> => {
    const response = await apiClient.put(`/admin/posts/${postId}/status?status=${status}`);
    return response.data;
};

export const getPendingPosts = async (page: number = 0, size: number = 10): Promise<PageResponse<AdminPostResponse>> => {
    const response = await apiClient.get(`/admin/posts/pending?page=${page}&size=${size}`);
    return response.data;
};