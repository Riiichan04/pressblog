"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {
    FileText, Plus, Edit2, Trash2,
    Globe, FileEdit, ChevronLeft, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { StaticPage } from "@/common/types/static-page";
import { deletePage, getAllPagesAdmin } from "@/services/static-page-service";
import { useAuth } from "@/context/auth-context";
import { ROLES } from "@/common/constants/roles";

export default function StaticPageManagement() {
    const { t } = useTranslation(["admin"]);
    const router = useRouter();
    const { user, hasRole, isLoading: isAuthLoading } = useAuth();

    const [pages, setPages] = useState<StaticPage[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPages = async (pageNumber: number) => {
            setIsLoading(true);
            try {
                const data = await getAllPagesAdmin(pageNumber, 10);
                setPages(data.content || []);
                setTotalPages(data.totalPages || 0);
            } catch {
                toast.error(t("page.load_error"));
            } finally {
                setIsLoading(false);
            }
        };
        fetchPages(currentPage);
    }, [t, currentPage]);

    useEffect(() => {
        if (!isAuthLoading && (!user || !hasRole(ROLES.ADMIN))) {
            toast.error(t("admin.no_permission"));
            router.replace("/");
        }
    }, [user, hasRole, isAuthLoading, router, t]);

    const handleDelete = async (id: number) => {
        if (!window.confirm(t("page.delete_confirm"))) return;

        try {
            await deletePage(id);
            toast.success(t("page.delete_success"));
        } catch {
            toast.error(t("page.delete_error"));
        }
    };

    if (isAuthLoading || !hasRole(ROLES.ADMIN)) {
        return <div className="min-h-screen bg-background flex items-center justify-center text-muted-foreground">Đang xác thực...</div>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground pt-10 pb-20 px-4 md:px-8">
            <div className="container mx-auto max-w-5xl space-y-8">

                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            <FileText className="h-8 w-8 text-primary" />
                            {t("page.title")}
                        </h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            {t("page.subtitle")}
                        </p>
                    </div>
                    <Button
                        onClick={() => router.push("/admin/page/editor")}
                        className="rounded-full gap-2 shadow-md"
                    >
                        <Plus size={16} /> {t("page.create_btn")}
                    </Button>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="border border-border/80 rounded-2xl bg-muted/10 overflow-hidden shadow-sm"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs tracking-wider border-b border-border/60">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">{t("page.table.title")}</th>
                                    <th className="px-6 py-4 font-semibold">{t("page.table.slug")}</th>
                                    <th className="px-6 py-4 font-semibold text-center">{t("page.table.status")}</th>
                                    <th className="px-6 py-4 font-semibold">{t("page.table.last_updated")}</th>
                                    <th className="px-6 py-4 font-semibold text-right">{t("page.table.actions")}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y border-border/40">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-muted-foreground">
                                            {t("page.table.loading")}
                                        </td>
                                    </tr>
                                ) : pages.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center py-12 text-muted-foreground italic">
                                            {t("page.table.empty")}
                                        </td>
                                    </tr>
                                ) : (
                                    pages.map((page) => (
                                        <tr key={page.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4 font-medium text-foreground">
                                                {page.title}
                                            </td>
                                            <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                                                /{page.slug}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {page.isPublished ? (
                                                    <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none rounded-full px-3">
                                                        <Globe size={12} className="mr-1.5" /> {t("page.table.status_live")}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-400 border-none rounded-full px-3">
                                                        <FileEdit size={12} className="mr-1.5" /> {t("page.table.status_draft")}
                                                    </Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground text-xs">
                                                {new Date(page.updatedAt).toLocaleDateString("vi-VN", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric"
                                                })}
                                            </td>
                                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => router.push(`/admin/page/editor?id=${page.id}`)}
                                                    className="h-8 w-8 rounded-md hover:text-primary cursor-pointer"
                                                >
                                                    <Edit2 size={15} />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(page.id)}
                                                    className="h-8 w-8 rounded-md hover:text-destructive text-muted-foreground cursor-pointer"
                                                >
                                                    <Trash2 size={15} />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-6 py-4">
                            <span className="text-xs text-muted-foreground">
                                {t("page.pagination", { current: currentPage + 1, total: totalPages })}
                            </span>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-md"
                                    disabled={currentPage === 0}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    <ChevronLeft size={16} />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 rounded-md"
                                    disabled={currentPage === totalPages - 1}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    <ChevronRight size={16} />
                                </Button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}