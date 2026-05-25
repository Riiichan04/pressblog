export interface PublicUserProfileResponse {
    username: string;
    displayName: string;
    bio: string;
    avatar: string;
    joinedAt: string;
}

export interface PublicPostResponse {
    id: number;
    title: string;
    slug: string;
    summary: string;
    thumbnail: string;
    viewCount: number;
    createdAt: string;
}