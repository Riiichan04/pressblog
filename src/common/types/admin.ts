export interface PendingPostDto {
    id: number;
    title: string;
    author: string;
    createdAt: string;
}

export interface ChartStatDto {
    date: string;
    count: number;
}

export interface AdminDashboardResponse {
    totalUsers: number;
    totalPosts: number;
    pendingPosts: number;
    totalViews: number;
    recentPendingPosts: PendingPostDto[];
    chartData: ChartStatDto[];
}

export interface AdminPostResponse {
    id: number;
    title: string;
    slug: string;
    authorName: string;
    category: string;
    status: string;
    isDeleted: boolean;
    createdAt: string;
}

export interface AdminUserResponse {
    id: number;
    username: string;
    email: string;
    displayName: string | null;
    roleName: string;
    active: boolean;
    verified: boolean;
    createdAt: string;
    avatarUrl: string
}

export interface CategoryResponse {
    id: number;
    name: string;
    slug: string;
    description: string;
    deleted: boolean;
}

export interface CategoryRequest {
    name: string;
    description: string;
}

export interface AdminCommentResponse {
    id: number;
    content: string;
    authorName: string;
    postId: number;
    postName: string;
    postSlug: string;
    isDeleted: boolean;
    createdAt: string;
    status: string;
    parentId?: number | null;
    parentContent?: string | null;
}