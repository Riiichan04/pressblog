import { UpdatePasswordRequest, UpdateProfileRequest, UserProfileResponse } from "@/common/types/profile";
import apiClient from "./api-client";
import { AuthResponse } from "@/common/types/auth";

export const getMyProfile = async (): Promise<UserProfileResponse> => {
    const response = await apiClient.get<UserProfileResponse>('/user/profile', {
        headers: { "Content-Type": "application/json" }
    });
    return response.data;
};

export const updateMyProfile = async (data: UpdateProfileRequest): Promise<UserProfileResponse> => {
    const response = await apiClient.put<UserProfileResponse>('/user/profile/update', data, {
        headers: { "Content-Type": "application/json" }
    });
    return response.data;
};

export const updatePassword = async (data: UpdatePasswordRequest): Promise<AuthResponse> => {
    const response = await apiClient.put<AuthResponse>('/user/password', data, {
        headers: {"Content-Type": "application/json"}
    })
    return response.data
}