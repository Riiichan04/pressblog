"use client";

import Cookies from 'js-cookie';
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
    Search, PenSquare, Bell, Languages, LogOut,
    User, Settings, Sun, Moon
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/auth-context";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader";
import { useRouter } from 'next/navigation';

export default function Navbar({ isEnableScroll }: { isEnableScroll?: boolean }) {
    const { user, logout } = useAuth();
    const { t, i18n } = useTranslation(["common"]);
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const router = useRouter()

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setMounted(true);
        });

        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const toggleLanguage = () => {
        const newLang = i18n.language === "vi" ? "en" : "vi";
        i18n.changeLanguage(newLang);
        localStorage.setItem("lng", newLang);
        Cookies.set('i18nextLng', newLang, { expires: 365 });
        router.refresh();
    };

    return (
        <nav
            className={cn(
                "fixed top-0 z-50 w-full transition-all duration-300",
                isScrolled && !isEnableScroll
                    ? "border-b bg-background/80 backdrop-blur-md h-16"
                    : "bg-transparent border-transparent h-20"
            )}
        >
            <div className="container mx-auto flex h-full items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2 group hover:opacity-80">
                        <Image
                            src="/logo.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="transition-transform group-hover:scale-110 rounded-md"
                            priority
                            unoptimized
                        />
                        <span className={cn(
                            "text-xl font-bold tracking-tighter transition-colors",
                            isScrolled && !isEnableScroll ? "text-primary" : "text-primary"
                        )}>
                            PRESS<span className={isScrolled && !isEnableScroll ? "text-foreground" : "text-primary"}>BLOG</span>
                        </span>
                    </Link>

                    {/* Search bar */}
                    <div className="relative hidden md:block w-80 group">
                        <Search className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 transition-all z-10",
                            isScrolled && !isEnableScroll
                                ? "text-muted-foreground"
                                : "text-foreground dark:text-white drop-shadow-md" // Đã sửa
                        )} />
                        <Input
                            type="search"
                            placeholder={t("actions.search_placeholder")}
                            className={cn(
                                "pl-10 border-none transition-all",
                                isScrolled && !isEnableScroll
                                    ? "bg-muted/50 focus-visible:ring-1"
                                    : "bg-black/5 dark:bg-black/20 text-foreground dark:text-white placeholder:text-foreground/70 dark:placeholder:text-white/80 focus-visible:ring-black/30 dark:focus-visible:ring-white/30 backdrop-blur-md" // Đã sửa
                            )}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Theme button */}
                    <Button
                        className={cn(
                            "cursor-pointer transition-colors",
                            !isScrolled && "text-foreground dark:text-white hover:bg-black/10 dark:hover:bg-white/10" // Đã sửa & gỡ bỏ theme === "light"
                        )}
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        {mounted && (
                            <div className="relative h-5 w-5 flex items-center justify-center ">
                                <Sun className="absolute h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            </div>
                        )}
                    </Button>

                    {/* Language button */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleLanguage}
                        className={cn(
                            "gap-2 px-2 cursor-pointer transition-colors",
                            !isScrolled && "text-foreground dark:text-white hover:bg-black/10 dark:hover:bg-white/10" // Đã sửa
                        )}
                    >
                        <Languages className="h-5 w-5" />
                        <span className="uppercase text-xs font-bold">{i18n.language}</span>
                    </Button>

                    {mounted ?
                        user ? (
                            <>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn(
                                        "relative cursor-pointer transition-colors",
                                        !isScrolled && "text-foreground dark:text-white hover:bg-black/10 dark:hover:bg-white/10" // Đã sửa
                                    )}
                                >
                                    <Bell className="h-5 w-5" />
                                </Button>

                                <Link href="/write" className="hidden md:block">
                                    <Button className={cn(
                                        "gap-2 rounded-full px-5 cursor-pointer transition-all",
                                        !isScrolled && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg dark:bg-white dark:text-black dark:hover:bg-white/90" // Đã tinh chỉnh để nổi bật cả 2 mode
                                    )}>
                                        <PenSquare className="h-4 w-4" />
                                        {t("navbar.write")}
                                    </Button>
                                </Link>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-10 w-10 rounded-full border cursor-pointer">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={user.avatar || ""} alt={user.username} />
                                                <AvatarFallback className={`${fallBackColor(user.username)} text-white`}>
                                                    {getFallback(user.displayName || user.username)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="end">
                                        <DropdownMenuLabel className="font-normal">
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
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer">
                                            <User className="mr-2 h-4 w-4" /> {t("navbar.profile")}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer">
                                            <Settings className="mr-2 h-4 w-4" /> {t("navbar.settings")}
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            className="text-destructive focus:bg-destructive/10 cursor-pointer"
                                            onClick={() => logout()}
                                        >
                                            <LogOut className="mr-2 h-4 w-4 text-destructive" /> {t("navbar.logout")}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/login">
                                    <Button
                                        className={cn(
                                            "cursor-pointer transition-colors",
                                            !isScrolled && "text-foreground dark:text-white hover:bg-black/10 dark:hover:bg-white/10" // Đã sửa
                                        )}
                                        variant="ghost"
                                    >
                                        {t("navbar.login")}
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button className={cn(
                                        "cursor-pointer transition-all",
                                        !isScrolled && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg dark:bg-white dark:text-black dark:hover:bg-white/90" // Đã tinh chỉnh
                                    )}>
                                        {t("navbar.get_started")}
                                    </Button>
                                </Link>
                            </div>
                        )
                        : <div className="flex items-center gap-3">
                            <Skeleton className="h-9 w-9 rounded-full hidden md:block" />
                            <Skeleton className="h-9 w-24 rounded-full hidden md:block" />
                            <Skeleton className="h-10 w-10 rounded-full border" />
                        </div>
                    }
                </div>
            </div>
        </nav >
    );
}