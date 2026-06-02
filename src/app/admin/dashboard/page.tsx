"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Users, FileText, Eye, Clock, ArrowRight } from "lucide-react";
import { getAdminStats } from "@/services/admin-service";
import { useTranslation } from "react-i18next";
import { AdminDashboardResponse } from "@/common/types/admin";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
    const { t } = useTranslation("admin");

    const [stats, setStats] = useState<AdminDashboardResponse>({
        totalUsers: 0,
        totalPosts: 0,
        pendingPosts: 0,
        totalViews: 0,
        recentPendingPosts: [],
        chartData: []
    });

    useEffect(() => {
        getAdminStats().then((data) => setStats(data));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.totalUsers")}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers}</div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.totalPosts")}</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPosts}</div>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow border-orange-200 dark:border-orange-900">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-orange-500">{t("dashboard.pendingPosts")}</CardTitle>
                        <Clock className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-500">{stats.pendingPosts}</div>
                        <p className="text-xs text-orange-500/80 mt-1">{t("dashboard.actionRequired")}</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">{t("dashboard.totalViews")}</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Khu vực Biểu đồ */}
                <Card className="col-span-1 lg:col-span-4 flex flex-col">
                    <CardHeader>
                        <CardTitle>{t("dashboard.chartTitle")}</CardTitle>
                        <CardDescription>{t("dashboard.chartDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                        <div className="h-87.5 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-muted" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} dy={10} className="fill-muted-foreground" />
                                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="fill-muted-foreground" />
                                    <Tooltip
                                        formatter={(value) => [value, t("dashboard.postUnit")]}
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1 lg:col-span-3 flex flex-col">
                    <CardHeader>
                        <CardTitle>{t("dashboard.urgentReview")}</CardTitle>
                        <CardDescription>{t("dashboard.urgentReviewDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <div className="space-y-6">
                            {stats.recentPendingPosts?.map((post) => (
                                <div key={post.id} className="flex items-center justify-between group">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none group-hover:text-primary transition-colors cursor-pointer line-clamp-1">
                                            {post.title}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {t("dashboard.by")} <span className="font-semibold text-foreground">{post.author}</span> • {new Date(post.createdAt).toLocaleString(t("dashboard.by") === "by" ? 'en-US' : 'vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}
                                        </p>
                                    </div>
                                    <Button variant="outline" size="sm" className="hidden group-hover:flex shrink-0 ml-2">
                                        {t("dashboard.approve")}
                                    </Button>
                                </div>
                            ))}

                            {(!stats.recentPendingPosts || stats.recentPendingPosts.length === 0) && (
                                <div className="flex h-full min-h-50 items-center justify-center text-muted-foreground text-sm">
                                    {t("dashboard.noPending")}
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <div className="p-4 pt-0 mt-auto">
                        <Link href="/admin/posts">
                            <Button variant="ghost" className="w-full justify-between text-muted-foreground hover:text-primary">
                                {t("dashboard.viewAll")} <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}