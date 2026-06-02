"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, X, Eye, FileText, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { getPendingPosts, updatePostStatus } from "@/services/admin-service";
import { toast } from "sonner";
import { AdminPostResponse } from "@/common/types/admin";
import { PostStatus } from "@/common/types/post";

export default function ApprovalsPage() {
    const { t } = useTranslation("admin");
    const [posts, setPosts] = useState<AdminPostResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const SIZE = 10; 

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const data = await getPendingPosts(page, SIZE);
                setPosts(data.content);
                setTotalPages(data.totalPages);
            } catch {
                toast.error(t("approvals.messages.error"));
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, [page, t]);

    const handleAction = async (postId: number, action: PostStatus.PUBLISHED | PostStatus.REJECTED) => {
        setProcessingId(postId);
        try {
            await updatePostStatus(postId, action);

            if (action === PostStatus.PUBLISHED) {
                toast.success(t("approvals.messages.approveSuccess"));
            } else {
                toast.success(t("approvals.messages.rejectSuccess"));
            }

            setPosts((prev) => prev.filter((post) => post.id !== postId));

            if (posts.length === 1 && page > 0) {
                setPage(page - 1);
            }
        } catch {
            toast.error(t("approvals.messages.error"));
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t("approvals.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("approvals.description")}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {t("approvals.listTitle")} ({posts.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[40%]">{t("approvals.table.title")}</TableHead>
                                    <TableHead>{t("approvals.table.author")}</TableHead>
                                    <TableHead>{t("approvals.table.category")}</TableHead>
                                    <TableHead>{t("approvals.table.date")}</TableHead>
                                    <TableHead className="text-right">{t("approvals.table.actions")}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center">
                                            <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                        </TableCell>
                                    </TableRow>
                                ) : posts.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                            {t("approvals.table.empty")} 🎉
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    posts.map((post) => (
                                        <TableRow key={post.id}>
                                            <TableCell className="font-medium">
                                                <div className="line-clamp-2">{post.title}</div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">{post.authorName}</Badge>
                                            </TableCell>
                                            <TableCell>{post.category}</TableCell>
                                            <TableCell>
                                                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/approvals/${post.slug}`}>
                                                        <Button variant="secondary" size="icon" title={t("approvals.actions.view")} className={"cursor-pointer"}>
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>

                                                    <Button
                                                        variant="destructive"
                                                        size="icon"
                                                        title={t("approvals.actions.reject")}
                                                        onClick={() => handleAction(post.id, PostStatus.REJECTED)}
                                                        disabled={processingId === post.id}
                                                        className={"cursor-pointer"}
                                                    >
                                                        {processingId === post.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <X className="h-4 w-4" />
                                                        )}
                                                    </Button>

                                                    <Button
                                                        variant="default"
                                                        size="icon"
                                                        title={t("approvals.actions.approve")}
                                                        onClick={() => handleAction(post.id, PostStatus.PUBLISHED)}
                                                        disabled={processingId === post.id} 
                                                        className={"cursor-pointer"}
                                                    >
                                                        {processingId === post.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Check className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {!isLoading && totalPages > 1 && (
                        <div className="flex items-center justify-end space-x-2 pt-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> {t("approvals.table.prev") || "Trước"}
                            </Button>
                            <div className="text-sm font-medium mx-2">
                                Trang {page + 1} / {totalPages}
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                            >
                                {t("approvals.table.next") || "Sau"} <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}