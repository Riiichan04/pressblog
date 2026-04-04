import { apiUrl } from "@/common/constants/api-url"
import { PostDetail, PostRequest } from "@/common/types/post"
import axios from "axios"
import apiClient from "./api-client"

export const uploadPost = async (data: PostRequest) => {
    try {
        const response = await apiClient.post<{ result: boolean, msg: string }>(`${apiUrl}/post/upload`, data)
        return response.data
    }
    catch {
        return null
    }
}

export const getFeaturedPost = async () => {
    try {
        const response = await axios.post<PostDetail>(`${apiUrl}/post/featured-post`)
        return response.data
    }
    catch {
        return null
    }
}

export const getNewestPost = async (page: number = 0, size: number = 5) => {
    try {
        const response = await axios.post<PostDetail[]>(`${apiUrl}/post/newest-post`, { page, size })
        return response.data
    }
    catch {
        return null
    }
}