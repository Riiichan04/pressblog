'use client'

import { DashboardStatResponse } from "@/common/types/dashboard";
import { OverviewChart } from "@/components/dashboard/overview-chart";
import { RecentPostsTable } from "@/components/dashboard/recent-post-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/services/dashboard-service";
import { Eye, FileText, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStatResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await getDashboardStats();
                console.log(data)
                setStats(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-muted-foreground">Đang tải dữ liệu...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Lỗi: {error}</div>;
    if (!stats) return null;

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2 w-full">
                        <div className="flex justify-between">
                            <CardTitle className="text-sm font-medium">Tổng bài viết</CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPosts}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2 flex">
                        <div className="flex justify-between">
                            <CardTitle className="text-sm font-medium">Tổng lượt xem</CardTitle>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2 flex">
                        <div className="flex justify-between">
                            <CardTitle className="text-sm font-medium">Tổng bình luận</CardTitle>
                            <MessageCircle className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalComments}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Biểu đồ và Bảng */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 mt-4">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Lưu lượng truy cập</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-0">
                        {/* Truyền mảng weekTrending vào prop của Component Chart */}
                        <OverviewChart data={stats.viewTrends} />
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Bài viết nổi bật</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* Truyền mảng trendingPost vào Component Table */}
                        <RecentPostsTable data={stats.trendingPosts} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}