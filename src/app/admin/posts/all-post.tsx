"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    Eye, Loader2, RefreshCw, Trash2, MoreVertical,
    ChevronLeft, ChevronRight, CheckCircle, Clock, XCircle
} from "lucide-react";
import Link from "next/link";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/auth-context";

import { getAllAdminPosts, restorePost, forceDeletePost, updatePostStatus } from "@/services/admin-service";
import { PERMISSIONS } from "@/common/constants/permissions";
import { PostStatus } from "@/common/types/post";
import { AdminPostResponse } from "@/common/types/admin";

export default function AllPostsTab() {
    const { t } = useTranslation("admin");
    const { hasPermission } = useAuth();

    const [posts, setPosts] = useState<AdminPostResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const SIZE = 10;

    const canDelete = hasPermission(PERMISSIONS.FORCE_DELETE_ANY_POST);
    const canRestore = hasPermission(PERMISSIONS.RESTORE_ANY_POST);
    const canChangeStatus = hasPermission([PERMISSIONS.UPDATE_ANY_POST, PERMISSIONS.APPROVE_POST]);

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const data = await getAllAdminPosts(page, SIZE);
                setPosts(data.content);
                setTotalPages(data.totalPages);
            } catch {
                toast.error(t("posts.messages.error"));
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, [page, t]);

    const handleUpdateStatus = async (id: number, newStatus: PostStatus) => {
        setProcessingId(id);
        try {
            await updatePostStatus(id, newStatus);
            toast.success(t("posts.messages.statusUpdateSuccess"));
            setPosts(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
        } catch {
            toast.error(t("posts.messages.error"));
        } finally {
            setProcessingId(null);
        }
    };

    const handleRestore = async (id: number) => {
        setProcessingId(id);
        try {
            await restorePost(id);
            toast.success(t("posts.messages.restoreSuccess"));
            setPosts(prev => prev.map(p => p.id === id ? { ...p, isDeleted: false } : p));
        } catch {
            toast.error(t("posts.messages.error"));
        } finally {
            setProcessingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm(t("posts.actions.deleteConfirm"))) return;
        setProcessingId(id);
        try {
            await forceDeletePost(id);
            toast.success(t("posts.messages.deleteSuccess"));
            setPosts(prev => prev.map(p => p.id === id ? { ...p, isDeleted: true } : p));
        } catch {
            toast.error(t("posts.messages.error"));
        } finally {
            setProcessingId(null);
        }
    };

    const getStatusBadge = (status: string, isDeleted: boolean) => {
        if (isDeleted) return <Badge variant="destructive">{t("posts.status.DELETED")}</Badge>;
        switch (status) {
            case PostStatus.PUBLISHED: return <Badge className="bg-green-500 hover:bg-green-600">{t("posts.status.PUBLISHED")}</Badge>;
            case PostStatus.PENDING: return <Badge variant="secondary" className="text-orange-500 hover:text-orange-600">{t("posts.status.PENDING")}</Badge>;
            case PostStatus.REJECTED: return <Badge variant="destructive">{t("posts.status.REJECTED")}</Badge>;
            case PostStatus.DRAFT: return <Badge variant="outline">{t("posts.status.DRAFT")}</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div className="border rounded-lg bg-card overflow-hidden p-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[40%]">{t("posts.table.title")}</TableHead>
                        <TableHead>{t("posts.table.author")}</TableHead>
                        <TableHead>{t("posts.table.status")}</TableHead>
                        <TableHead>{t("posts.table.date")}</TableHead>
                        <TableHead className="text-right">{t("posts.table.actions")}</TableHead>
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
                                {t("posts.table.empty")}
                            </TableCell>
                        </TableRow>
                    ) : (
                        posts.map((post) => (
                            <TableRow key={post.id} className={post.isDeleted ? "opacity-60 bg-muted/30" : ""}>
                                <TableCell className="font-medium">
                                    <div className="line-clamp-2">{post.title}</div>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">{post.authorName}</span>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(post.status, post.isDeleted)}
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">

                                        <Link href={`/admin/approvals/${post.slug}`} target="_blank">
                                            <Button className={"cursor-pointer"} variant="outline" size="icon" title={t("posts.actions.view")}>
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>

                                        {post.isDeleted ? (
                                            canRestore && (
                                                <Button variant="outline" size="icon" onClick={() => handleRestore(post.id)} disabled={processingId === post.id} className="cursor-pointer text-green-600 hover:bg-green-50 hover:text-green-700">
                                                    {processingId === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                                </Button>
                                            )
                                        ) : (
                                            <>
                                                {canDelete && (
                                                    <Button className={"cursor-pointer"} variant="destructive" size="icon" onClick={() => handleDelete(post.id)} disabled={processingId === post.id}>
                                                        {processingId === post.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    </Button>
                                                )}

                                                {canChangeStatus && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button className={"cursor-pointer"} variant="ghost" size="icon" disabled={processingId === post.id}>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>{t("posts.actions.changeStatus")}</DropdownMenuLabel>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(post.id, PostStatus.PUBLISHED)}>
                                                                <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {t("posts.status.PUBLISHED")}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(post.id, PostStatus.PENDING)}>
                                                                <Clock className="h-4 w-4 mr-2 text-orange-500" /> {t("posts.status.PENDING")}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleUpdateStatus(post.id, PostStatus.REJECTED)}>
                                                                <XCircle className="h-4 w-4 mr-2 text-red-500" /> {t("posts.status.REJECTED")}
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}

                                            </>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-end space-x-2 pt-4 mt-4 border-t">
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                        <ChevronLeft className="h-4 w-4 mr-1" /> {t("posts.pagination.prev")}
                    </Button>
                    <div className="text-sm font-medium mx-2">
                        {t("posts.pagination.page")} {page + 1} / {totalPages}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                        {t("posts.pagination.next")} <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            )}
        </div>
    );
}