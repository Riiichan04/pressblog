"use client";

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

export default function Navbar() {
    const { user, logout } = useAuth();
    const { t, i18n } = useTranslation(["common"]);
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        //Put mounted in the second render
        const frame = requestAnimationFrame(() => {
            setMounted(true);
        });
        return () => cancelAnimationFrame(frame);
    }, []);

    const toggleLanguage = () => {
        const newLang = i18n.language === "vi" ? "en" : "vi";
        i18n.changeLanguage(newLang);
        localStorage.setItem("lng", newLang);
    };

    const getFallback = (name: string) => {
        return name.split(" ").map(n => n[0]).join("").toUpperCase().substring(0, 2);
    };

    const colors = ["bg-orange-500", "bg-blue-500", "bg-green-500", "bg-purple-500"];
    const colorIndex = (user?.username?.charCodeAt(0) || 0) % colors.length;

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
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
                        <span className="text-xl font-bold tracking-tighter text-primary">
                            PRESS<span className="text-foreground">BLOG</span>
                        </span>
                    </Link>

                    {/* Search bar */}
                    <div className="relative hidden md:block w-80">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={t("actions.search_placeholder")}
                            className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
                        />
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-4">
                    {/* Theme button */}
                    <Button
                        className="cursor-pointer"
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                        {mounted && (
                            <>
                                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            </>
                        )}
                    </Button>

                    {/* Language button */}
                    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="gap-2 px-2 cursor-pointer">
                        <Languages className="h-5 w-5" />
                        <span className="uppercase text-xs font-bold">{i18n.language}</span>
                    </Button>


                    {user ? (
                        // User button
                        <>
                            {/* Notification */}
                            <Button variant="ghost" size="icon" className="relative cursor-pointer">
                                <Bell className="h-5 w-5" />
                                {/* <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive"></span> */}
                            </Button>

                            {/* Write */}
                            <Link href="/write" className="hidden md:block">
                                <Button className="gap-2 rounded-full px-5 cursor-pointer">
                                    <PenSquare className="h-4 w-4" />
                                    {t("navbar.write")}
                                </Button>
                            </Link>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full border cursor-pointer">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.avatar || ""} alt={user.username} />
                                            <AvatarFallback className={`${colors[colorIndex]} text-white`}>
                                                {user ? getFallback(user.displayName || user.username) : "U"}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end">
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-8 w-8 shrink-0">
                                                <AvatarImage src={user.avatar || ""} alt={user.username} />
                                                <AvatarFallback className={`${colors[colorIndex]} text-white`}>
                                                    {user ? getFallback(user.displayName || user.username) : "U"}
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
                        //Login and register button
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button className="cursor-pointer" variant="ghost">{t("navbar.login")}</Button>
                            </Link>
                            <Link href="/register">
                                <Button className="cursor-pointer">{t("navbar.get_started")}</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav >
    );
}