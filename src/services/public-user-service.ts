import apiClient from "./api-client";
import { PublicUserProfileResponse, PublicPostResponse } from "@/common/types/public-user";
import { PageResponse } from "@/common/types/page-response";

export const getPublicProfile = async (username: string): Promise<PublicUserProfileResponse> => {
    const response = await apiClient.get<PublicUserProfileResponse>(`/user/author/${username}`);
    return response.data;
};

export const getPublicUserPosts = async (username: string, page = 0, size = 9): Promise<PageResponse<PublicPostResponse>> => {
    const response = await apiClient.get<PageResponse<PublicPostResponse>>(`/user/author/${username}/posts?page=${page}&size=${size}`);
    return response.data;
};