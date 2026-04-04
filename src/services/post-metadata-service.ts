import { apiUrl } from "@/common/constants/api-url"
import { PageResponse } from "@/common/types/page-response"
import { Category, Tag } from "@/common/types/post-metadata"
import axios from "axios"

export const getCurrentCategory = () => {
    return axios.get<PageResponse<Category>>(`${apiUrl}/post/metadata/category`).then(res => res.data)
}

export const getCurrentTag = () => {
    return axios.get<PageResponse<Tag>>(`${apiUrl}/post/metadata/tag`).then(res => res.data)
}