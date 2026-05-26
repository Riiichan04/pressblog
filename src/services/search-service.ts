import { apiUrl } from "@/common/constants/api-url";
import { PageResponse } from "@/common/types/page-response";
import { PublicPostResponse, PublicUserProfileResponse } from "@/common/types/public-user";
import axios from "axios";

export const searchPublicPosts = async (keyword: string, page = 0, size = 12): Promise<PageResponse<PublicPostResponse>> => {
    const response = await axios.get<PageResponse<PublicPostResponse>>(
        `${apiUrl}/search/keyword?q=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
    );
    return response.data;
};

export const searchPublicAuthors = async (keyword: string, page = 0, size = 12): Promise<PageResponse<PublicUserProfileResponse>> => {
    const response = await axios.get<PageResponse<PublicUserProfileResponse>>(
        `${apiUrl}/search/author?q=${encodeURIComponent(keyword)}&page=${page}&size=${size}`
    );
    return response.data;
};