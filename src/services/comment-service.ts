import { CommentResponse } from "@/common/types/comment";
import { PageResponse } from "@/common/types/page-response";
import axios from "axios";
import { apiUrl } from "@/common/constants/api-url";
import apiClient from "./api-client";

export const getRootComments = async (postId: number, page = 0, size = 10): Promise<PageResponse<CommentResponse>> => {
    const response = await axios.get<PageResponse<CommentResponse>>(`${apiUrl}/comments/posts/${postId}?page=${page}&size=${size}`);
    return response.data;
};

export const getReplies = async (commentId: number, page = 0, size = 10): Promise<PageResponse<CommentResponse>> => {
    const response = await axios.get<PageResponse<CommentResponse>>(`${apiUrl}/comments/${commentId}/replies?page=${page}&size=${size}`);
    return response.data;
};

export const createComment = async (payload: { postId: number, content: string, commentId?: number }) => {
    const response = await apiClient.post(`/comments`, payload);
    return response.data;
};