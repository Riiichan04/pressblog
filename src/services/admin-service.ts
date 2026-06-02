import { AdminDashboardResponse, AdminPostResponse, AdminUserResponse } from "@/common/types/admin";
import apiClient from "./api-client";
import { PostDetail, PostStatus } from "@/common/types/post";
import { PageResponse } from "@/common/types/page-response";

// For admin dashboard

export const getAdminStats = async (): Promise<AdminDashboardResponse> => {
    const response = await apiClient.get<AdminDashboardResponse>("/admin/dashboard/stats");
    return response.data;
};

// For blog management

export const updatePostStatus = async (postId: number, status: PostStatus): Promise<string> => {
    const response = await apiClient.put(`/admin/posts/${postId}/status?status=${status}`);
    return response.data;
};

export const getPendingPosts = async (page: number = 0, size: number = 10): Promise<PageResponse<AdminPostResponse>> => {
    const response = await apiClient.get(`/admin/posts/pending?page=${page}&size=${size}`);
    return response.data;
};

export const getAdminPostBySlug = async (slug: string) => {
    const response = await apiClient.get<PostDetail>(`/admin/posts/${slug}`);
    return response.data;
};

export const getAllAdminPosts = async (page: number = 0, size: number = 10): Promise<PageResponse<AdminPostResponse>> => {
    const response = await apiClient.get(`/admin/posts?page=${page}&size=${size}`);
    return response.data;
};

export const restorePost = async (id: number): Promise<string> => {
    const response = await apiClient.put(`/admin/posts/${id}/restore`);
    return response.data;
};

export const forceDeletePost = async (id: number): Promise<string> => {
    const response = await apiClient.delete(`/admin/posts/${id}`);
    return response.data;
};

// For user management
export const getAllUsers = async (page: number = 0, size: number = 10): Promise<PageResponse<AdminUserResponse>> => {
    const response = await apiClient.get(`/admin/users?page=${page}&size=${size}`);
    return response.data;
};

export const toggleUserStatus = async (id: number): Promise<string> => {
    const response = await apiClient.put(`/admin/users/${id}/toggle-status`);
    return response.data;
};

export const changeUserRole = async (id: number, roleName: string): Promise<string> => {
    const response = await apiClient.put(`/admin/users/${id}/role?roleName=${roleName}`);
    return response.data;
};
