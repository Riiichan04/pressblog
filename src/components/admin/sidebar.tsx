// components/admin/AdminSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Tags, MessageSquare, LogOut } from "lucide-react";
import { cn } from "@/lib/utils"; // Hàm merge class của Shadcn

const navItems = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Tổng quan" },
    { href: "/admin/users", icon: Users, label: "Người dùng" },
    { href: "/admin/posts", icon: FileText, label: "Bài viết" },
    { href: "/admin/categories", icon: Tags, label: "Danh mục" },
    { href: "/admin/comments", icon: MessageSquare, label: "Bình luận" },
];

export default function AdminSidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 border-r bg-white dark:bg-zinc-900 flex flex-col h-screen sticky top-0">
            <div className="p-6 border-b">
                <h1 className="font-bold text-xl tracking-tight text-primary">PressBlog Admin</h1>
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
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t">
                <button className="flex w-full items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-colors">
                    <LogOut className="h-4 w-4" />
                    Đăng xuất
                </button>
            </div>
        </aside>
    );
}