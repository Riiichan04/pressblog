import { StaticPage, StaticPageRequest } from "@/common/types/static-page";
import apiClient from "./api-client";

export const pageService = {
    // Public API
    getPublicPage: async (slug: string): Promise<StaticPage> => {
        const res = await apiClient.get(`/pages/${slug}`);
        return res.data;
    },

    // Admin APIs
    getAllPagesAdmin: async (page = 0, size = 10) => {
        const res = await apiClient.get(`/pages/admin/all?page=${page}&size=${size}`);
        return res.data;
    },

    createPage: async (data: StaticPageRequest) => {
        const res = await apiClient.post('/pages', data);
        return res.data;
    },

    updatePage: async (id: number, data: StaticPageRequest) => {
        const res = await apiClient.put(`/pages/${id}`, data);
        return res.data;
    },

    deletePage: async (id: number) => {
        const res = await apiClient.delete(`/pages/${id}`);
        return res.data;
    },

    getPageById: async (id: number): Promise<StaticPage> => {
        const res = await apiClient.get(`/pages/admin/${id}`);
        return res.data;
    },
};