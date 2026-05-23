"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { getMyPosts } from "@/services/post-service"
import { toast } from "sonner"
import { PostTableItem } from "@/components/dashboard/post-columns"
import { PageResponse } from "@/common/types/page-response"
import { useTranslation } from "react-i18next"

export default function PostsPage() {
    const { user } = useAuth();
    const { t } = useTranslation("dashboard");
    const [pageData, setPageData] = useState<PageResponse<PostTableItem> | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(0);

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const data = await getMyPosts(user.id.toString(), pageIndex, 10);
                setPageData(data);
            } catch (error: unknown) {
                toast.error((error as Error).message || t("posts.fetchError"));
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, [user?.id, pageIndex, t]);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("posts.title")}</h1>
                    <p className="text-muted-foreground mt-1">{t("posts.desc")}</p>
                </div>
            </div>

            {loading && !pageData ? (
                <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-card text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                    <p>{t("posts.loadingPosts")}</p>
                </div>
            ) : (
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("posts.colTitle")}</TableHead>
                                <TableHead className="w-30">{t("posts.colStatus")}</TableHead>
                                <TableHead className="w-25 text-right">{t("posts.colViews")}</TableHead>
                                <TableHead className="w-37.5 text-right">{t("posts.colUpdatedAt")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pageData?.content.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center">
                                        {t("posts.noPosts")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pageData?.content.map((post) => (
                                    <TableRow key={post.id}>
                                        <TableCell className="font-medium">{post.title}</TableCell>
                                        <TableCell>{post.status}</TableCell>
                                        <TableCell className="text-right">{post.views}</TableCell>
                                        <TableCell className="text-right">{post.updatedAt}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {pageData && pageData.totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-4 border-t">
                            <div className="text-sm text-muted-foreground">
                                {t("posts.page")} {pageData.number + 1} / {pageData.totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPageIndex(p => Math.max(0, p - 1))}
                                    disabled={pageData.number === 0 || loading}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    {t("posts.prev")}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPageIndex(p => Math.min(pageData.totalPages - 1, p + 1))}
                                    disabled={pageData.number === pageData.totalPages - 1 || loading}
                                >
                                    {t("posts.next")}
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}