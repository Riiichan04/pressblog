import { StaticPage, StaticPageRequest } from "@/common/types/static-page";
import apiClient from "./api-client";

// Public API
export const getPublicPage = async (slug: string): Promise<StaticPage> => {
    const res = await apiClient.get(`/pages/${slug}`);
    return res.data;
}

// Admin APIs
export const getAllPagesAdmin = async (page = 0, size = 10) => {
    const res = await apiClient.get(`/pages/admin/all?page=${page}&size=${size}`);
    return res.data;
}

export const createPage = async (data: StaticPageRequest) => {
    const res = await apiClient.post('/pages', data);
    return res.data;
}

export const updatePage = async (id: number, data: StaticPageRequest) => {
    const res = await apiClient.put(`/pages/${id}`, data);
    return res.data;
}

export const deletePage = async (id: number) => {
    const res = await apiClient.delete(`/pages/${id}`);
    return res.data;
}

export const getPageById = async (id: number): Promise<StaticPage> => {
    const res = await apiClient.get(`/pages/admin/${id}`);
    return res.data;
}