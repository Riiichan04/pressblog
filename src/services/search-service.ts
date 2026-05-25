import { apiUrl } from "@/common/constants/api-url";
import { PageResponse } from "@/common/types/page-response";
import { PublicPostResponse } from "@/common/types/public-user";
import axios from "axios";

export const searchPublicPosts = async (keyword: string, page = 0, size = 12): Promise<PageResponse<PublicPostResponse>> => {
    const response = await axios.get<PageResponse<PublicPostResponse>>(
        `${apiUrl}/search/keyword?q=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
    );
    return response.data;
};