import { PostStatus } from "./post";

export interface DailyViewStat {
    views: number;
    date: string;
}

export interface TrendingPostDto {
    id: string;
    name: string;
    status: PostStatus;
    views: number;
    comments: number;
    createdAt: string;
}

export interface DashboardStatResponse {
    totalPosts: number;
    totalViews: number;
    totalComments: number;
    weekTrending: DailyViewStat[];
    trendingPosts: TrendingPostDto[];
}