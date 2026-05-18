"use client"

import Link from "next/link";
import { LayoutDashboard, FileText, Settings, User } from "lucide-react";
import Navbar from "@/components/nav-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader";
import { useAuth } from "@/context/auth-context";
import { usePathname } from "next/navigation";

const sidebarLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tổng quan" },
    { href: "/dashboard/posts", icon: FileText, label: "Bài viết" },
    { href: "/dashboard/profile", icon: User, label: "Hồ sơ" },
    { href: "/dashboard/settings", icon: Settings, label: "Cài đặt" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar isEnableScroll={true} />
            <div className="flex flex-1 pt-20 bg-muted/40">
                <aside className="sticky top-20 hidden w-64 flex-col gap-6 border-r bg-background px-4 py-6 md:flex h-[calc(100vh-5rem)] overflow-y-auto">
                    {/* Phần Avatar giữ nguyên */}
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={user.avatar || ""} alt={user.username} />
                            <AvatarFallback className={`${fallBackColor(user.username)} text-white`}>
                                {getFallback(user.displayName || user.username)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1 min-w-0">
                            <p className="text-sm font-medium leading-tight truncate">
                                {user.displayName || user.username}
                            </p>
                            <p className="text-xs leading-tight text-muted-foreground truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* Phần Menu render bằng .map() */}
                    <nav className="flex flex-col gap-2">
                        {sidebarLinks.map((link) => {
                            const Icon = link.icon;
                            // So sánh đường dẫn hiện tại với link.href
                            // Lưu ý: dùng === để "/dashboard" không bị dính vào "/dashboard/posts"
                            const isActive = pathname === link.href;

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`text-sm flex items-center gap-2 rounded-lg px-3 py-2 transition-all ${isActive
                                        ? "bg-primary/10 text-primary font-medium" // Đang chọn thì sáng lên
                                        : "text-muted-foreground hover:text-primary hover:bg-primary/5" // Chưa chọn thì mờ
                                        }`}
                                >
                                    <Icon size={"1rem"} />
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                <main className="flex-1 p-6 md:p-8 min-h-[calc(100vh-5rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}