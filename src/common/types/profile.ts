export interface UserProfileResponse {
    id: number;
    username: string;
    email: string;
    displayName: string;
    bio: string;
    avatar: string;
    createdAt: string;
}

export interface UpdateProfileRequest {
    displayName: string;
    bio: string;
    avatar: string;
}

export interface UpdatePasswordRequest {
    id: number,
    oldPassword: string,
    newPassword: string
}
