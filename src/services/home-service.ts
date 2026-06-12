import { apiUrl } from "@/common/constants/api-url"
import { AuthorStatsDto } from "@/common/types/home"
import axios from "axios"

export const getTrendingTags = async () => {
    const res = await axios.get<string[]>(`${apiUrl}/trending-tags`)
    return res.data
}

export const getFeaturedAuthors = async () => {
    const res = await axios.get<AuthorStatsDto[]>(`${apiUrl}/featured-authors`)
    return res.data
}