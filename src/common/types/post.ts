export enum PostStatus {
    DRAFT = 0,
    PUBLISHED = 1,
    PRIVATE = 2,
    DELETED = 3
}

export interface Author {
    id: number;
    email: string;
    displayName: string;
    username: string;
    avatar: string | null;
    description: string;
    // role: "ADMIN" | "USER";
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
    excerpt: string,
    language: "VI" | "EN" //Convert to global provider later
}

export interface PostFormData {
    id: number;
    name: string;
    excerpt: string;
    content: string;
    tags: string[];
    status: PostStatus;
}