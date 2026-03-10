import { apiUrl } from "@/common/constants/api-url"
import { PostDetail } from "@/common/types/post"
import axios from "axios"

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