"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCheck, Inbox, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useNotification } from "@/context/notification-context";
import NotificationComponent from "@/components/notification-component";

export default function NotificationsPage() {
    const { t } = useTranslation("notification");

    const {
        notifications,
        isLoading,
        handleMarkAllAsRead,
        handleNotificationClick
    } = useNotification();

    return (
        <div className="min-h-screen bg-background/50 pt-24 pb-12">
            <div className="container max-w-3xl mx-auto px-4 sm:px-6">

                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3 text-foreground">
                            <Bell className="h-8 w-8 text-primary" />
                            {t("navbar.notifications", "Thông báo")}
                        </h1>
                        <p className="text-muted-foreground mt-2 text-sm">
                            {t("notification.subtitle", "Cập nhật những tương tác và tin tức mới nhất của bạn.")}
                        </p>
                    </div>

                    <Button
                        variant="secondary"
                        size="sm"
                        className="gap-2 shrink-0 rounded-full shadow-sm hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={handleMarkAllAsRead}
                        disabled={notifications.length === 0 || notifications.every(n => n.read)}
                    >
                        <CheckCheck className="h-4 w-4" />
                        <span className="font-medium">
                            {t("notification.mark_read", "Đánh dấu đã đọc hết")}
                        </span>
                    </Button>
                </div>

                <div className="bg-card rounded-2xl border shadow-sm overflow-hidden">
                    {isLoading ? (
                        <div className="flex flex-col divide-y divide-border">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-start gap-4 p-5">
                                    <Skeleton className="h-10 w-10 rounded-full shrink-0" />
                                    <div className="space-y-2 flex-1">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-24 text-center px-4">
                            <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-6 ring-8 ring-background">
                                <Inbox className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-foreground">
                                {t("notification.empty_title", "Chưa có thông báo nào")}
                            </h3>
                            <p className="text-muted-foreground text-sm max-w-sm">
                                {t("notification.empty_desc", "Mọi cập nhật về bài viết và tương tác của bạn sẽ xuất hiện ở đây. Hãy tiếp tục hoạt động nhé!")}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col divide-y divide-border">
                            {notifications.map((noti) => (
                                <div
                                    key={noti.id}
                                    onClick={() => handleNotificationClick(noti)}
                                    className={cn(
                                        "group relative flex gap-4 p-5 sm:px-6 transition-all duration-200 cursor-pointer hover:bg-muted/50",
                                        !noti.read ? "bg-primary/3" : "bg-transparent"
                                    )}
                                >
                                    {!noti.read && (
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <NotificationComponent noti={noti} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}