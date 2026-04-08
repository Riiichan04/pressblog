export enum PostStatus {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    PRIVATE = 'PRIVATE',
    SCHEDULED = 'SCHEDULED',
}

export interface Author {
    id: number;
    name: string;
    username: string;
    avatar: string | null;
    bio: string;
    role: "ADMIN" | "USER";
}

export interface PostDetail {
    id: number;
    name: string;
    slug: string;
    content: string;
    thumbnail: string;
    author: Author;
    categoryName: string;
    tagNames: string[];
    status: PostStatus;
    viewCount: number;
    updatedAt: string;
}

export interface PostRequest {
    name: string,
    content: string,
    email: string,
    categoryName: string,
    listTag: string[],
    thumbnail: string | null,
    language: "VI" | "EN" //Convert to global provider later
}