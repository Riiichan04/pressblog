"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Tags, MessageSquare, LogOut, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import { PERMISSIONS } from "@/common/constants/permissions";
import { useTranslation } from "react-i18next";

const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, labelKey: "overview" },
    { href: "/admin/users", icon: Users, labelKey: "users" },
    { href: "/admin/posts", icon: FileText, labelKey: "posts" },
    { href: "/admin/categories", icon: Tags, labelKey: "categories" },
    { href: "/admin/comments", icon: MessageSquare, labelKey: "comments" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { hasPermission, logout } = useAuth();

    const { t } = useTranslation("admin");

    const canApprovePost = hasPermission(PERMISSIONS.APPROVE_POST);

    return (
        <aside className="w-64 border-r bg-white dark:bg-zinc-900 flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b">
                <h1 className="font-bold text-xl tracking-tight text-primary">{t("sidebar.title")}</h1>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <item.icon className="h-4 w-4" />
                            {t(`sidebar.${item.labelKey}`)}
                        </Link>
                    );
                })}

                {canApprovePost && (
                    <>
                        <div className="my-4 border-t dark:border-zinc-800" />
                        <Link
                            href="/admin/approvals"
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                pathname.startsWith("/admin/approvals")
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}
                        >
                            <CheckCircle className="h-4 w-4" />
                            {/* 🎯 Dịch nút Phê duyệt */}
                            {t("sidebar.approvals")}
                        </Link>
                    </>
                )}
            </nav>

            <div className="p-4 border-t">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors"
                >
                    <LogOut className="h-4 w-4" />
                    {t("sidebar.logout")}
                </button>
            </div>
        </aside>
    );
}