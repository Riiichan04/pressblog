import { AdminCommentResponse, AdminDashboardResponse, AdminPostResponse, AdminTagResponse, AdminUserResponse, CategoryRequest, CategoryResponse } from "@/common/types/admin";
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

export const getAllAdminPosts = async (page: number = 0, size: number = 10, category?: string | null): Promise<PageResponse<AdminPostResponse>> => {
    let url = `/admin/posts?page=${page}&size=${size}`;
    if (category) {
        url += `&category=${category}`;
    }
    const response = await apiClient.get(url);
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

export const updateFeaturedPostsOrder = async (orderedIds: number[]) => {
    const response = await apiClient.put("/admin/posts/featured/order", orderedIds);
    return response.data;
};

export const getFeaturedPosts = async (): Promise<AdminPostResponse[]> => {
    const response = await apiClient.get("/admin/posts/featured");
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

// For category management
export const getAllCategories = async (page: number = 0, size: number = 10): Promise<PageResponse<CategoryResponse>> => {
    const response = await apiClient.get(`/admin/categories?page=${page}&size=${size}`);
    return response.data;
};

export const createCategory = async (data: CategoryRequest): Promise<CategoryResponse> => {
    const response = await apiClient.post(`/admin/categories`, data);
    return response.data;
};

export const updateCategory = async (id: number, data: CategoryRequest): Promise<CategoryResponse> => {
    const response = await apiClient.put(`/admin/categories/${id}`, data);
    return response.data;
};

export const safeDeleteCategory = async (id: number): Promise<string> => {
    const response = await apiClient.delete(`/admin/categories/${id}`);
    return response.data;
};

export const forceDeleteCategory = async (id: number): Promise<string> => {
    const response = await apiClient.delete(`/admin/categories/${id}/force`);
    return response.data;
};

export const restoreCategory = async (id: number): Promise<string> => {
    const response = await apiClient.put(`/admin/categories/${id}/restore`);
    return response.data;
};

// For comment management
export const getAllAdminComments = async (page: number = 0, size: number = 10, postSlug?: string | null, status?: string | null): Promise<PageResponse<AdminCommentResponse>> => {
    let url = `/admin/comments?page=${page}&size=${size}`;
    if (postSlug) url += `&postSlug=${postSlug}`;
    if (status) url += `&status=${status}`;
    const response = await apiClient.get(url);
    return response.data;
};

export const approveComment = async (id: number, status: string): Promise<string> => {
    const response = await apiClient.put(`/admin/comments/${id}/approve`, `"${status}"`, {
        headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
};

export const safeDeleteComment = async (id: number): Promise<string> => {
    const response = await apiClient.delete(`/admin/comments/${id}`);
    return response.data;
};

export const restoreComment = async (id: number): Promise<string> => {
    const response = await apiClient.put(`/admin/comments/${id}/restore`);
    return response.data;
};

// For tag management
export const getAllTagsAdmin = async (page: number, size: number) => {
    const res = await apiClient.get<PageResponse<AdminTagResponse>>(`/admin/tags?page=${page}&size=${size}`);
    return res.data;
};

export const updateTag = async (id: number, name: string) => {
    const res = await apiClient.put<AdminTagResponse>(`/admin/tags/${id}`, { name });
    return res.data;
};

export const toggleTagApproval = async (id: number) => {
    const res = await apiClient.post<AdminTagResponse>(`/admin/tags/${id}/approve`);
    return res.data;
};

export const forceDeleteTag = async (id: number) => {
    const res = await apiClient.delete(`/admin/tags/${id}`);
    return res.data;
};