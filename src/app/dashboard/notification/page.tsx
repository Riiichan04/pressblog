"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ChevronLeft, ChevronRight, CheckCheck } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { getNotifications, markAsRead } from "@/services/notification-service"
import { toast } from "sonner"
import { PageResponse } from "@/common/types/page-response"
import { NotificationItem } from "@/common/types/notification"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// 🎯 Dùng lại Context để đồng bộ biến đếm trên Navbar khi thao tác ở đây
import { useNotification } from "@/context/notification-context"
import NotificationComponent from "@/components/notification-component"

export default function NotificationsDashboardPage() {
    const { user } = useAuth();
    const { t } = useTranslation("notification");

    const [pageData, setPageData] = useState<PageResponse<NotificationItem> | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageIndex, setPageIndex] = useState(0);

    const { handleMarkAllAsRead, setUnreadCount } = useNotification();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const res = await getNotifications(pageIndex, 10);
            // Giả định service trả về res.data là PageResponse
            setPageData(res.data);
        } catch (error: unknown) {
            toast.error((error as Error).message || t("fetch-error", "Lỗi khi tải thông báo"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const res = await getNotifications(pageIndex, 10);
                setPageData(res.data);
            } catch (error: unknown) {
                toast.error((error as Error).message || t("fetch-error"));
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchNotifications();
        }
    }, [user, pageIndex, t]);

    // Xử lý khi click vào 1 thông báo trong bảng
    const onNotificationClick = async (noti: NotificationItem) => {
        if (!noti.read) {
            try {
                await markAsRead(noti.id);
                // Cập nhật state cục bộ để UI bảng đổi màu ngay lập tức
                setPageData(prev => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        content: prev.content.map(n => n.id === noti.id ? { ...n, read: true } : n)
                    };
                });

                // Đồng bộ trừ biến đếm trên Navbar
                setUnreadCount((prev: number) => Math.max(0, prev - 1));
            } catch (error) {
                console.error("Lỗi đánh dấu đã đọc:", error);
            }
        }
        // Có thể thêm router.push(noti.targetUrl) ở đây nếu muốn chuyển trang
    };

    const handleMarkAll = async () => {
        await handleMarkAllAsRead(); // Gọi logic của Context
        fetchNotifications(); // Refresh lại dữ liệu bảng hiện tại
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header: Tiêu đề và Nút Đánh dấu tất cả */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">{t("navbar.notifications", "Thông báo")}</h1>
                    <p className="text-muted-foreground mt-1">
                        {t("notification.subtitle", "Quản lý toàn bộ thông báo và cập nhật của bạn")}
                    </p>
                </div>
                <Button
                    variant="secondary"
                    className="gap-2 shadow-sm hover:bg-primary/10 hover:text-primary transition-colors cursor-pointer"
                    onClick={handleMarkAll}
                    disabled={!pageData || pageData.content.every(n => n.read)}
                >
                    <CheckCheck className="h-4 w-4" />
                    <span className="hidden sm:inline font-medium">
                        {t("notification.mark_read", "Đánh dấu đã đọc hết")}
                    </span>
                </Button>
            </div>

            {loading && !pageData ? (
                <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-card text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                    <p>{t("notification.loading", "Đang tải thông báo...")}</p>
                </div>
            ) : (
                <div className="border rounded-md bg-card">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t("notification.colContent", "Nội dung thông báo")}</TableHead>
                                <TableHead className="w-32 text-center">{t("notification.colStatus", "Trạng thái")}</TableHead>
                                <TableHead className="w-40 text-right">{t("notification.colDate", "Ngày nhận")}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pageData?.content.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                                        {t("notification.empty_title", "Bạn chưa có thông báo nào")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                pageData?.content.map((noti) => (
                                    <TableRow
                                        key={noti.id}
                                        className={cn(
                                            "cursor-pointer transition-colors",
                                            !noti.read ? "bg-primary/[0.03]" : ""
                                        )}
                                        onClick={() => onNotificationClick(noti)}
                                    >
                                        <TableCell>
                                            {/* Tái sử dụng Component hiển thị nội dung để ăn i18n */}
                                            <NotificationComponent noti={noti} />
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <span className={cn(
                                                "px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider",
                                                !noti.read
                                                    ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-400"
                                                    : "bg-muted text-muted-foreground"
                                            )}>
                                                {!noti.read ? t("state.not-read") : t("state.read")}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-muted-foreground">
                                            {new Date(noti.createdAt).toLocaleDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                    {/* Phân trang */}
                    {pageData && pageData.totalPages > 1 && (
                        <div className="flex items-center justify-between px-4 py-4 border-t">
                            <div className="text-sm text-muted-foreground">
                                {t("pagination.page", "Trang")} {pageData.number + 1} / {pageData.totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => setPageIndex(p => Math.max(0, p - 1))}
                                    disabled={pageData.number === 0 || loading}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    {t("pagination.prev", "Trước")}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="cursor-pointer"
                                    onClick={() => setPageIndex(p => Math.min(pageData.totalPages - 1, p + 1))}
                                    disabled={pageData.number === pageData.totalPages - 1 || loading}
                                >
                                    {t("pagination.next", "Tiếp")}
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