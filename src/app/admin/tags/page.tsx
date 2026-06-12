"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    Edit, Trash2, Loader2, ChevronLeft, ChevronRight, Hash, CheckCircle2, XCircle
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

import { useAuth } from "@/context/auth-context";
import { PERMISSIONS } from "@/common/constants/permissions";
// import { ROLES } from "@/common/constants/roles";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { getAllTagsAdmin, updateTag, toggleTagApproval, forceDeleteTag } from "@/services/admin-service";
import { AdminTagResponse } from "@/common/types/admin";

export default function AdminTagsPage() {
    const { t } = useTranslation("admin");
    const { hasPermission } = useAuth();

    const [tags, setTags] = useState<AdminTagResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const SIZE = 10;

    const canUpdate = hasPermission(PERMISSIONS.UPDATE_TAG);
    const canDelete = hasPermission(PERMISSIONS.DELETE_TAG);
    const canApprove = hasPermission(PERMISSIONS.APPROVE_TAG);
    // const isAdmin = hasRole(ROLES.ADMIN);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<AdminTagResponse | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [tagToDelete, setTagToDelete] = useState<number | null>(null);

    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true);
            try {
                const data = await getAllTagsAdmin(page, SIZE);
                setTags(data.content);
                setTotalPages(data.totalPages);
            } catch {
                toast.error(t("tags.messages.fetchError"));
            } finally {
                setIsLoading(false);
            }
        };
        fetchTags();
    }, [page, t]);

    const handleOpenForm = (tag: AdminTagResponse) => {
        setEditingTag(tag);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const name = form.get("name") as string;

        if (!name.trim() || !editingTag) return;

        setIsSaving(true);
        try {
            const res = await updateTag(editingTag.id, name);
            setTags(prev => prev.map(t => t.id === editingTag.id ? res : t));
            toast.success(t("tags.messages.updateSuccess"));
            setIsFormOpen(false);
        } catch {
            toast.error(t("tags.messages.updateError"));
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleApprove = async (id: number) => {
        setProcessingId(id);
        try {
            const res = await toggleTagApproval(id);
            setTags(prev => prev.map(t => t.id === id ? { ...t, approved: res.approved } : t));
            toast.success(res.approved ? t("tags.messages.approveSuccess") : t("tags.messages.unapproveSuccess"));
        } catch {
            toast.error(t("tags.messages.approveError"));
        } finally {
            setProcessingId(null);
        }
    };

    const executeDelete = async () => {
        if (!tagToDelete) return;
        setProcessingId(tagToDelete);
        try {
            await forceDeleteTag(tagToDelete);
            toast.success(t("tags.messages.deleteSuccess"));
            setTags(prev => prev.filter(t => t.id !== tagToDelete));
        } catch {
            toast.error(t("tags.messages.deleteError"));
        } finally {
            setProcessingId(null);
            setTagToDelete(null);
        }
    };

    return (
        <div className="space-y-6 p-6 lg:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t("tags.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("tags.description")}</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Hash className="h-5 w-5" />
                        {t("tags.listTitle")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%]">{t("tags.table.name")}</TableHead>
                                <TableHead className="w-[30%]">{t("tags.table.slug")}</TableHead>
                                <TableHead>{t("tags.table.status")}</TableHead>
                                <TableHead className="text-right">{t("tags.table.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : tags.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                        {t("tags.emptyList")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                tags.map((tag) => (
                                    <TableRow key={tag.id}>
                                        <TableCell>
                                            <div className="font-medium text-primary">#{tag.name}</div>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground font-mono">
                                            {tag.slug}
                                        </TableCell>
                                        <TableCell>
                                            {tag.approved ? (
                                                <Badge className="bg-green-500 hover:bg-green-600">{t("tags.status.approved")}</Badge>
                                            ) : (
                                                <Badge variant="secondary" className="text-amber-600 bg-amber-100 dark:bg-amber-900/30">{t("tags.status.pending")}</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {canApprove && (
                                                    <Button
                                                        className="cursor-pointer"
                                                        variant={tag.approved ? "secondary" : "default"}
                                                        size="icon"
                                                        onClick={() => handleToggleApprove(tag.id)}
                                                        disabled={processingId === tag.id}
                                                        title={tag.approved ? t("tags.actions.unapprove") : t("tags.actions.approve")}
                                                    >
                                                        {processingId === tag.id ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                                            tag.approved ? <XCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                                                    </Button>
                                                )}

                                                {canUpdate && (
                                                    <Button className="cursor-pointer" variant="outline" size="icon" onClick={() => handleOpenForm(tag)} disabled={processingId === tag.id}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                )}

                                                {canDelete && (
                                                    <Button className="cursor-pointer" variant="destructive" size="icon" onClick={() => setTagToDelete(tag.id)} disabled={processingId === tag.id}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
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
                                <ChevronLeft className="h-4 w-4 mr-1" /> {t("tags.pagination.prev")}
                            </Button>
                            <div className="text-sm font-medium mx-2">
                                {t("tags.pagination.page")} {page + 1} / {totalPages}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                                {t("tags.pagination.next")} <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("tags.form.editTitle")}</DialogTitle>
                    </DialogHeader>
                    <form key={editingTag?.id || "new"} onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t("tags.form.nameLabel")}</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={editingTag?.name || ""}
                                required
                            />
                            <p className="text-xs text-muted-foreground">{t("tags.form.slugHint")}</p>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>{t("tags.form.cancel")}</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t("tags.form.save")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <ConfirmDialog
                isOpen={tagToDelete !== null}
                onClose={() => setTagToDelete(null)}
                onConfirm={executeDelete}
                title={t("tags.deleteConfirm.title")}
                description={t("tags.deleteConfirm.description")}
                cancelText={t("tags.deleteConfirm.cancel")}
                confirmText={t("tags.deleteConfirm.confirm")}
            />
        </div>
    );
}