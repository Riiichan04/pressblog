"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Tags, MessageSquare, LogOut, Settings, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { PERMISSIONS } from "@/common/constants/permissions";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import Image from "next/image";

export default function AdminSidebar() {
    const pathname = usePathname();
    const { hasPermission, logout } = useAuth();
    const { t } = useTranslation("admin");

    const navGroups = useMemo(() => {
        return [
            {
                items: [
                    { href: "/admin/dashboard", icon: LayoutDashboard, labelKey: "overview", show: true },
                ]
            },
            {
                label: t("sidebar.label.content"),
                items: [
                    { href: "/admin/posts", icon: FileText, labelKey: "posts", show: hasPermission([PERMISSIONS.UPDATE_ANY_POST, PERMISSIONS.DELETE_ANY_POST, PERMISSIONS.APPROVE_POST]) },
                    { href: "/admin/featured", icon: LayoutTemplate, labelKey: "featured", show: hasPermission(PERMISSIONS.UPDATE_ANY_POST) },
                    { href: "/admin/categories", icon: Tags, labelKey: "categories", show: hasPermission(PERMISSIONS.UPDATE_CATEGORY) },
                    { href: "/admin/comments", icon: MessageSquare, labelKey: "comments", show: hasPermission(PERMISSIONS.DELETE_ANY_COMMENT) },
                ]
            },
            {
                label: t("sidebar.label.system"),
                items: [
                    { href: "/admin/users", icon: Users, labelKey: "users", show: hasPermission(PERMISSIONS.VIEW_USERS) },
                    { href: "/admin/settings", icon: Settings, labelKey: "settings", show: false },
                ]
            }
        ];
    }, [hasPermission, t]);

    return (
        <aside className="w-64 border-r bg-white dark:bg-zinc-950 flex flex-col h-screen sticky top-0 shadow-sm">
            <div className="p-4 border-b flex items-center gap-3">
                <div className="bg-primary text-primary-foreground rounded-lg">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={32}
                        height={32}
                        className="transition-transform group-hover:scale-110 rounded-md"
                        priority
                        unoptimized
                    />
                </div>
                <h1 className="font-bold text-lg tracking-tight uppercase">{t("sidebar.title")}</h1>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
                {navGroups.map((group, index) => {
                    const visibleItems = group.items.filter(item => item.show);
                    if (visibleItems.length === 0) return null;

                    return (
                        <div key={index}>
                            <h4 className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                {group.label}
                            </h4>
                            <div className="space-y-1">
                                {visibleItems.map((item) => {
                                    const isActive = pathname.startsWith(item.href);
                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-md"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <item.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                                            {t(`sidebar.${item.labelKey}`, item.labelKey === 'settings' ? 'Cài đặt' : "")}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </nav>

            <div className="p-4 border-t bg-muted/20">
                <button
                    onClick={logout}
                    className="cursor-pointer flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    {t("sidebar.logout")}
                </button>
            </div>
        </aside>
    );
}