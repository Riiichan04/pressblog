"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    CheckCircle, XCircle, Trash2, Loader2, RefreshCw,
    ChevronLeft, ChevronRight, ExternalLink, X, MessageSquare,
    MoreVertical, Clock, Eye
} from "lucide-react";
import Link from "next/link";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { useAuth } from "@/context/auth-context";
import { PERMISSIONS } from "@/common/constants/permissions";
import { getAllAdminComments, approveComment, safeDeleteComment, restoreComment } from "@/services/admin-service";
import { AdminCommentResponse } from "@/common/types/admin";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { CommentDetailDialog } from "./detail-dialog";

interface CommentListProps {
    filterStatus: string | null;
    postSlug: string | null;
    onClearPostFilter: () => void;
}

export default function CommentList({ filterStatus, postSlug, onClearPostFilter }: CommentListProps) {
    const { t } = useTranslation("admin");
    const { hasPermission } = useAuth();

    const [comments, setComments] = useState<AdminCommentResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
    const [selectedComment, setSelectedComment] = useState<AdminCommentResponse | null>(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const SIZE = 10;

    const canDelete = hasPermission(PERMISSIONS.DELETE_ANY_COMMENT);
    const canApprove = hasPermission(PERMISSIONS.APPROVE_COMMENT);

    useEffect(() => {
        const fetchComments = async () => {
            setIsLoading(true);
            try {
                const data = await getAllAdminComments(page, SIZE, postSlug, filterStatus);
                setComments(data.content);
                setTotalPages(data.totalPages);
            } catch {
                toast.error(t("comments.messages.error"));
            } finally {
                setIsLoading(false);
            }
        };
        fetchComments();
    }, [page, postSlug, filterStatus, t]);

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        setProcessingId(id);
        try {
            await approveComment(id, newStatus);
            toast.success(t("comments.messages.statusUpdateSuccess"));
            if (filterStatus === "PENDING") {
                setComments(prev => prev.filter(c => c.id !== id));
            } else {
                setComments(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
            }
        } catch {
            toast.error(t("comments.messages.error"));
        } finally {
            setProcessingId(null);
        }
    };

    const handleRestore = async (id: number) => {
        setProcessingId(id);
        try {
            await restoreComment(id);
            toast.success(t("comments.messages.restoreSuccess"));
            setComments(prev => prev.map(c => c.id === id ? { ...c, isDeleted: false } : c));
        } catch {
            toast.error(t("comments.messages.error"));
        } finally {
            setProcessingId(null);
        }
    };

    const executeDelete = async () => {
        if (!commentToDelete) return;
        setProcessingId(commentToDelete);
        try {
            await safeDeleteComment(commentToDelete);
            toast.success(t("comments.messages.deleteSuccess"));
            if (filterStatus === "PENDING") {
                setComments(prev => prev.filter(c => c.id !== commentToDelete));
            } else {
                setComments(prev => prev.map(c => c.id === commentToDelete ? { ...c, isDeleted: true } : c));
            }
        } catch {
            toast.error(t("comments.messages.error"));
        } finally {
            setProcessingId(null);
            setCommentToDelete(null);
        }
    };

    const getStatusBadge = (status: string, isDeleted: boolean) => {
        if (isDeleted) return <Badge variant="destructive">{t("comments.status.DELETED")}</Badge>;
        switch (status) {
            case "APPROVED": return <Badge className="bg-green-500 hover:bg-green-600">{t("comments.status.APPROVED")}</Badge>;
            case "PENDING": return <Badge variant="secondary" className="text-orange-500 hover:text-orange-600">{t("comments.status.PENDING")}</Badge>;
            case "REJECTED": return <Badge variant="destructive">{t("comments.status.REJECTED")}</Badge>;
            default: return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight">{t("comments.title")}</h2>
                <p className="text-muted-foreground mt-2">{t("comments.description")}</p>
            </div>

            <div className="border rounded-lg bg-card overflow-hidden p-4">

                {postSlug && (
                    <div className="mb-4 flex items-center justify-between rounded-md bg-blue-50/50 p-3 border border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/50">
                        <div className="flex items-center text-sm text-blue-800 dark:text-blue-300">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            <span>{t("comments.messages.filtering")} <span className="font-semibold">{postSlug}</span></span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClearPostFilter} className="h-8 text-blue-800 hover:bg-blue-100 dark:text-blue-300 dark:hover:bg-blue-900/50">
                            <X className="mr-1 h-4 w-4" /> {t("comments.actions.clearFilter")}
                        </Button>
                    </div>
                )}

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[30%]">{t("comments.table.content")}</TableHead>
                            <TableHead>{t("comments.table.author")}</TableHead>
                            <TableHead className="w-[20%]">{t("comments.table.post")}</TableHead>
                            <TableHead>{t("comments.table.status")}</TableHead>
                            <TableHead className="text-right">{t("comments.table.actions")}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow><TableCell colSpan={5} className="h-32 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
                        ) : comments.length === 0 ? (
                            <TableRow><TableCell colSpan={5} className="h-32 text-center text-muted-foreground">{t("comments.table.empty")}</TableCell></TableRow>
                        ) : (
                            comments.map((cmt: AdminCommentResponse) => (
                                <TableRow key={cmt.id} className={cmt.isDeleted ? "opacity-60 bg-muted/30" : ""}>
                                    <TableCell>
                                        <div className="flex flex-col gap-1.5">
                                            {cmt.parentId && (
                                                <div className="flex items-center gap-1 w-fit text-[11px] font-medium bg-muted/70 text-muted-foreground px-2 py-1 rounded-md border border-muted-foreground/20">
                                                    <span className="opacity-70">{t("comments.detail.replyingTo")}</span>
                                                    <span className="italic line-clamp-1 max-w-50" title={cmt.parentContent || ""}>
                                                        &quot;{cmt.parentContent}&quot;
                                                    </span>
                                                </div>
                                            )}
                                            <div className="text-sm font-medium line-clamp-2" title={cmt.content}>
                                                {cmt.content}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell><span className="text-sm font-semibold">{cmt.authorName}</span></TableCell>
                                    <TableCell><div className="text-sm line-clamp-1 text-muted-foreground">{cmt.postName}</div></TableCell>
                                    <TableCell>{getStatusBadge(cmt.status, cmt.isDeleted)}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" onClick={() => setSelectedComment(cmt)} title={t("comments.actions.viewDetail")}>
                                                <Eye className="h-4 w-4" />
                                            </Button>

                                            <Link href={cmt.postSlug ? `/blog/${cmt.postSlug}` : "/"} target="_blank">
                                                <Button variant="outline" size="icon" title={t("comments.actions.viewPost")}><ExternalLink className="h-4 w-4 " /></Button>
                                            </Link>

                                            {cmt.isDeleted ? (
                                                canDelete && (
                                                    <Button variant="outline" size="icon" onClick={() => handleRestore(cmt.id)} disabled={processingId === cmt.id} className="text-green-600 hover:bg-green-50"><RefreshCw className="h-4 w-4" /></Button>
                                                )
                                            ) : (
                                                <>
                                                    {canDelete && (
                                                        <Button variant="destructive" size="icon" onClick={() => setCommentToDelete(cmt.id)} disabled={processingId === cmt.id}><Trash2 className="h-4 w-4" /></Button>
                                                    )}
                                                    {canApprove && (
                                                        filterStatus === "PENDING" ? (
                                                            <>
                                                                <Button variant="outline" size="icon" onClick={() => handleUpdateStatus(cmt.id, "APPROVED")} disabled={processingId === cmt.id} className="text-green-600 hover:bg-green-50 border-green-200" title={t("comments.actions.approve")}><CheckCircle className="h-4 w-4" /></Button>
                                                                <Button variant="outline" size="icon" onClick={() => handleUpdateStatus(cmt.id, "REJECTED")} disabled={processingId === cmt.id} className="text-red-500 hover:bg-red-50 border-red-200" title={t("comments.actions.reject")}><XCircle className="h-4 w-4" /></Button>
                                                            </>
                                                        ) : (
                                                            <DropdownMenu>
                                                                <DropdownMenuTrigger asChild>
                                                                    <Button className="cursor-pointer" variant="ghost" size="icon" disabled={processingId === cmt.id}>
                                                                        <MoreVertical className="h-4 w-4" />
                                                                    </Button>
                                                                </DropdownMenuTrigger>
                                                                <DropdownMenuContent align="end">
                                                                    <DropdownMenuLabel>Đổi trạng thái</DropdownMenuLabel>
                                                                    <DropdownMenuSeparator />
                                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(cmt.id, "APPROVED")}>
                                                                        <CheckCircle className="h-4 w-4 mr-2 text-green-500" /> {t("comments.status.APPROVED")}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(cmt.id, "PENDING")}>
                                                                        <Clock className="h-4 w-4 mr-2 text-orange-500" /> {t("comments.status.PENDING")}
                                                                    </DropdownMenuItem>
                                                                    <DropdownMenuItem onClick={() => handleUpdateStatus(cmt.id, "REJECTED")}>
                                                                        <XCircle className="h-4 w-4 mr-2 text-red-500" /> {t("comments.status.REJECTED")}
                                                                    </DropdownMenuItem>
                                                                </DropdownMenuContent>
                                                            </DropdownMenu>
                                                        )
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
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}><ChevronLeft className="h-4 w-4 mr-1" /> {t("comments.pagination.prev")}</Button>
                        <div className="text-sm font-medium mx-2">{t("comments.pagination.page")} {page + 1} / {totalPages}</div>
                        <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>{t("comments.pagination.next")} <ChevronRight className="h-4 w-4 ml-1" /></Button>
                    </div>
                )}

                <ConfirmDialog
                    isOpen={commentToDelete !== null}
                    onClose={() => setCommentToDelete(null)}
                    onConfirm={executeDelete}
                    title={t("comments.actions.deleteConfirmTitle")}
                    description={t("comments.actions.deleteConfirm")}
                    cancelText={t("comments.actions.cancel")}
                    confirmText={t("comments.actions.delete")}
                />

                <CommentDetailDialog
                    comment={selectedComment}
                    onClose={() => setSelectedComment(null)}
                    getStatusBadge={getStatusBadge}
                />
            </div>
        </div>

    );
}