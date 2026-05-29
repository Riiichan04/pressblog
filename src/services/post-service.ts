import { apiUrl } from "@/common/constants/api-url"
import { PostDetail, PostRequest, PostStatus } from "@/common/types/post"
import axios from "axios"
import apiClient from "./api-client"
import { PostTableItem } from "@/components/dashboard/post-columns"
import { PageResponse } from "@/common/types/page-response"

export const uploadPost = async (data: PostRequest) => {
    try {
        const response = await apiClient.post<{ result: boolean, msg: string }>(`${apiUrl}/post/upload`, data)
        return response.data
    }
    catch {
        return {
            result: false,
            msg: "Error"
        }
    }
}

export const getFeaturedPost = async () => {
    try {
        const response = await axios.get<PostDetail>(`${apiUrl}/featured`)
        return response.data
    }
    catch {
        return null
    }
}

export const getNewestPost = async () => {
    try {
        const response = await axios.get<PostDetail[]>(`${apiUrl}/newest`)
        return response.data
    }
    catch {
        return null
    }
}

export const getPostBySlug = async (slug: string) => {
    try {
        const response = await axios.get<PostDetail>(`${apiUrl}/post/slug/${slug}`)
        return response.data
    }
    catch {
        return null
    }
}



export const getMyPosts = async (userId: string, page = 0, size = 50): Promise<PageResponse<PostTableItem>> => {
    const response = await apiClient.get<PageResponse<PostDetail>>(`/post/author/${userId}?page=${page}&size=${size}`, {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status !== 200) {
        throw new Error("Error when load your blogs");
    }

    const pageData = response.data;

    const mappedContent: PostTableItem[] = pageData.content.map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.name,
        status: post.status || PostStatus.PRIVATE,
        views: post.viewCount || 0,
        updatedAt: post.updatedAt
            ? new Date(post.updatedAt).toLocaleDateString('vi-VN')
            : "N/A"
    }));

    return {
        ...pageData,
        content: mappedContent
    };
};