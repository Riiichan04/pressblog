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