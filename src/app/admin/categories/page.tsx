"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
    Plus, Edit, Trash, Trash2, RefreshCw, Loader2, ChevronLeft, ChevronRight, Tags,
    List
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useAuth } from "@/context/auth-context";
import { PERMISSIONS } from "@/common/constants/permissions";
import { ROLES } from "@/common/constants/roles";
import {
    getAllCategories, createCategory, updateCategory, safeDeleteCategory,
    forceDeleteCategory, restoreCategory
} from "@/services/admin-service";
import { CategoryResponse } from "@/common/types/admin";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AdminCategoriesPage() {
    const { t } = useTranslation("admin");
    const { hasPermission, hasRole } = useAuth();

    const [categories, setCategories] = useState<CategoryResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const SIZE = 10;

    const canCreate = hasPermission(PERMISSIONS.CREATE_CATEGORY);
    const canUpdate = hasPermission(PERMISSIONS.UPDATE_CATEGORY);
    const canDelete = hasPermission(PERMISSIONS.DELETE_CATEGORY);
    const isAdmin = hasRole(ROLES.ADMIN);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCat, setEditingCat] = useState<CategoryResponse | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [catToDelete, setCatToDelete] = useState<{ id: number, isForce: boolean } | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setIsLoading(true);
            try {
                const data = await getAllCategories(page, SIZE);
                setCategories(data.content);
                setTotalPages(data.totalPages);
            } catch {
                toast.error(t("categories.messages.error"));
            } finally {
                setIsLoading(false);
            }
        };
        fetchCategories();
    }, [page, t]);

    const handleOpenForm = (cat?: CategoryResponse) => {
        setEditingCat(cat || null);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = new FormData(e.currentTarget);
        const name = form.get("name") as string;
        const description = form.get("description") as string;

        if (!name.trim()) return;

        setIsSaving(true);
        try {
            const payload = { name, description };
            if (editingCat) {
                const res = await updateCategory(editingCat.id, payload);
                setCategories(prev => prev.map(c => c.id === editingCat.id ? res : c));
                toast.success(t("categories.messages.updateSuccess"));
            } else {
                const res = await createCategory(payload);
                setCategories(prev => [res, ...prev]);
                toast.success(t("categories.messages.createSuccess"));
            }
            setIsFormOpen(false);
        } catch {
            toast.error(t("categories.messages.error"));
        } finally {
            setIsSaving(false);
        }
    };

    const executeDelete = async () => {
        if (!catToDelete) return;
        setProcessingId(catToDelete.id);
        try {
            if (catToDelete.isForce) {
                await forceDeleteCategory(catToDelete.id);
            } else {
                await safeDeleteCategory(catToDelete.id);
            }
            toast.success(t("categories.messages.deleteSuccess"));
            setCategories(prev => prev.map(c => c.id === catToDelete.id ? { ...c, deleted: true } : c));
        } catch {
            toast.error(catToDelete.isForce ? t("categories.messages.error") : t("categories.messages.softDeleteError"));
        } finally {
            setProcessingId(null);
            setCatToDelete(null);
        }
    };

    const handleRestore = async (id: number) => {
        setProcessingId(id);
        try {
            await restoreCategory(id);
            toast.success(t("categories.messages.restoreSuccess"));
            setCategories(prev => prev.map(c => c.id === id ? { ...c, deleted: false } : c));
        } catch {
            toast.error(t("categories.messages.error"));
        } finally {
            setProcessingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t("categories.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("categories.description")}</p>
                </div>
                {canCreate && (
                    <Button onClick={() => handleOpenForm()}>
                        <Plus className="mr-2 h-4 w-4" /> {t("categories.createBtn")}
                    </Button>
                )}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Tags className="h-5 w-5" />
                        {t("categories.subTitle")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[30%]">{t("categories.table.name")}</TableHead>
                                <TableHead className="w-[25%]">{t("categories.table.slug")}</TableHead>
                                <TableHead>{t("categories.table.status")}</TableHead>
                                <TableHead className="text-right">{t("categories.table.actions")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center">
                                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                                    </TableCell>
                                </TableRow>
                            ) : categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                        {t("categories.noCategories")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((cat) => (
                                    <TableRow key={cat.id}>
                                        <TableCell className={cat.deleted ? "opacity-60 bg-muted/30" : ""}>
                                            <div className="font-medium">{cat.name}</div>
                                            <div className="text-xs text-muted-foreground mt-1 line-clamp-1">{cat.description}</div>
                                        </TableCell>
                                        <TableCell className={cn("text-sm text-muted-foreground font-mono", cat.deleted ? "opacity-60 bg-muted/30" : "")}>
                                            {cat.slug}
                                        </TableCell>
                                        <TableCell className={cat.deleted ? "opacity-60 bg-muted/30" : ""}>
                                            {cat.deleted ? (
                                                <Badge variant="destructive">{t("categories.state.disabled")}</Badge>
                                            ) : (
                                                <Badge className="bg-green-500 hover:bg-green-600">{t("categories.state.active")}</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                {cat.deleted ? (
                                                    <>
                                                        {canUpdate && (
                                                            <Button variant="outline" size="icon" onClick={() => handleRestore(cat.id)} disabled={processingId === cat.id} className="text-green-600 hover:bg-green-50 cursor-pointer">
                                                                {processingId === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                                            </Button>
                                                        )}
                                                        {isAdmin && (
                                                            <Button className="cursor-pointer" variant="destructive" size="icon" onClick={() => setCatToDelete({ id: cat.id, isForce: true })} disabled={processingId === cat.id}>
                                                                {processingId === cat.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                            </Button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <Link href={`/admin/posts?category=${cat.slug}`}>
                                                            <Button className="cursor-pointer" variant="outline" size="icon" title="Xem bài viết">
                                                                <List className="h-4 w-4" />
                                                            </Button>
                                                        </Link>

                                                        {canUpdate && (
                                                            <Button className="cursor-pointer" variant="default" size="icon" onClick={() => handleOpenForm(cat)} disabled={processingId === cat.id} title={t("categories.actions.edit")}>
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        {canDelete && (
                                                            <Button variant="outline" size="icon" onClick={() => setCatToDelete({ id: cat.id, isForce: false })} disabled={processingId === cat.id} className="text-orange-500 hover:text-orange-600 hover:bg-orange-50 cursor-pointer" title={t("categories.actions.safeDelete")}>
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
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
                                <ChevronLeft className="h-4 w-4 mr-1" /> {t("categories.pagination.prev")}
                            </Button>
                            <div className="text-sm font-medium mx-2">
                                {t("categories.pagination.page")} {page + 1} / {totalPages}
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>
                                {t("categories.pagination.next")} <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCat ? t("categories.form.updateTitle") : t("categories.form.createTitle")}</DialogTitle>
                    </DialogHeader>
                    <form key={editingCat?.id || "new"} onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">{t("categories.form.name")}</Label>
                            <Input
                                id="name"
                                name="name"
                                defaultValue={editingCat?.name || ""}
                                placeholder={t("categories.form.createTitlePlaceholder")}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">{t("categories.form.description")}</Label>
                            <Textarea
                                id="description"
                                name="description"
                                defaultValue={editingCat?.description || ""}
                                placeholder={t("categories.form.createDescriptionPlaceholder")}
                                rows={3}
                            />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>{t("categories.form.cancel")}</Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {t("categories.form.save")}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={catToDelete !== null} onOpenChange={(open) => !open && setCatToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t("categories.actions.deleteConfirmTitle")}</AlertDialogTitle>
                        <AlertDialogDescription className={catToDelete?.isForce ? "text-red-500 font-medium" : ""}>
                            {catToDelete?.isForce ? t("categories.actions.forceDeleteConfirm") : t("categories.actions.deleteConfirm")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("categories.form.cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={executeDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            {catToDelete?.isForce ? t("categories.actions.forceDelete") : t("categories.actions.safeDelete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}