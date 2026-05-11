"use client"

import Link from "next/link";
import { LayoutDashboard, FileText, Settings, User } from "lucide-react";
import Navbar from "@/components/nav-bar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader";
import { useAuth } from "@/context/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    if (!user) return null; // Nên return null thay vì return không có gì

    return (
        <div className="flex min-h-screen flex-col">
            <Navbar isEnableScroll={true} />
            <div className="flex flex-1 pt-20 bg-muted/40">
                <aside className="sticky top-20 hidden w-64 flex-col gap-6 border-r px-4 py-6 md:flex h-[calc(100vh-5rem)] overflow-y-auto">
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

                    <nav className="flex flex-col gap-2">
                        <Link href="/dashboard" className="text-sm flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-primary transition-all hover:text-primary">
                            <LayoutDashboard size={"1rem"} />
                            Tổng quan
                        </Link>
                        <Link href="/dashboard/posts" className="text-sm flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                            <FileText size={"1rem"} />
                            Bài viết
                        </Link>
                        <Link href="/dashboard/profile" className="text-sm flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                            <User size={"1rem"} />
                            Hồ sơ
                        </Link>
                        <Link href="/dashboard/settings" className="text-sm flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
                            <Settings size={"1rem"} />
                            Cài đặt
                        </Link>
                    </nav>
                </aside>

                <main className="flex-1 p-6 md:p-8 min-h-[calc(100vh-5rem)]">
                    {children}
                </main>
            </div>
        </div>
    );
}