"use client";

import { useTheme } from "next-themes";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Sun, Moon, LogOut, User as UserIcon, Languages, Home } from "lucide-react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import Cookies from 'js-cookie';

export default function AdminHeader() {
    const { setTheme, theme } = useTheme();
    const { user, logout } = useAuth();
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const { t, i18n } = useTranslation("admin");

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setMounted(true);
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    const toggleLanguage = () => {
        const newLang = i18n.language === "vi" ? "en" : "vi";
        i18n.changeLanguage(newLang);
        localStorage.setItem("lng", newLang);
        Cookies.set('i18nextLng', newLang, { expires: 365 });
        router.refresh();
    };

    return (
        <header className="sticky top-0 z-100 flex h-16 shrink-0 items-center gap-x-4 border-b bg-background px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 justify-end">
            <div className="flex items-center gap-2 md:gap-4">

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleLanguage}
                    className="gap-2 px-2 cursor-pointer transition-colors rounded-full md:rounded-md"
                >
                    <Languages className="h-5 w-5" />
                    <span className="uppercase text-xs font-bold hidden md:inline-block">
                        {mounted ? i18n.resolvedLanguage : "..."}
                    </span>
                </Button>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="rounded-full"
                >
                    {mounted && (
                        <div className="relative h-5 w-5 flex items-center justify-center">
                            <Sun className="absolute h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                        </div>
                    )}
                </Button>

                {/* User Dropdown */}
                {mounted ? (
                    user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full border">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={user.avatar || ""} alt={user.username} />
                                        <AvatarFallback className={`${fallBackColor(user.username)} text-white text-xs`}>
                                            {getFallback(user.displayName || user.username)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col">
                                        <div className="flex gap-2 items-center">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={user.avatar || ""} alt={user.username} />
                                                <AvatarFallback className={`${fallBackColor(user.username)} text-white text-xs`}>
                                                    {getFallback(user.displayName || user.username)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">{user.displayName || user.username}</p>
                                                <p className="text-xs leading-none text-muted-foreground mt-1">{user.email}</p>
                                            </div>
                                        </div>
                                        <p className="ms-11 text-[10px] uppercase font-bold text-primary mt-2"> {user.role}</p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/dashboard")}>
                                    <UserIcon className="mr-2 h-4 w-4" /> {t("navbar.detail")}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onClick={() => router.push("/")}>
                                    <Home className="mr-2 h-4 w-4" /> {t("navbar.homeNav")}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => logout()}>
                                    <LogOut className="mr-2 h-4 w-4 text-destructive" /> {t("navbar.logout")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Skeleton className="h-9 w-9 rounded-full" />
                    )
                ) : (
                    <Skeleton className="h-9 w-9 rounded-full" />
                )}
            </div>
        </header>
    );
}