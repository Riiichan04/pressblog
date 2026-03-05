"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { Search, PenSquare, Bell, Languages, LogOut, User, Settings } from "lucide-react";
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
import { AuthDto } from "@/common/types/auth";

interface NavbarProps {
    user?: AuthDto | null;
}

export default function Navbar({ user }: NavbarProps) {
    const { t, i18n } = useTranslation(["common"]);

    const toggleLanguage = () => {
        const newLang = i18n.language === "vi" ? "en" : "vi";
        i18n.changeLanguage(newLang);
    };

    return (
        <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold tracking-tighter text-primary">
                        PRESS<span className="text-foreground">BLOG</span>
                    </Link>

                    {/* Search bar */}
                    <div className="relative hidden md:block w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder={t("navbar.search_placeholder")}
                            className="pl-9 bg-muted/50 border-none focus-visible:ring-1"
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 md:gap-4">

                    {/* Nút đổi ngôn ngữ */}
                    <Button variant="ghost" size="icon" onClick={toggleLanguage} title="Switch Language">
                        <Languages className="h-5 w-5" />
                    </Button>

                    {user ? (
                        //Logged in
                        <>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-destructive"></span>
                            </Button>

                            <Link href="/write" className="hidden md:block">
                                <Button className="gap-2 rounded-full">
                                    <PenSquare className="h-4 w-4" />
                                    {t("navbar.write")}
                                </Button>
                            </Link>

                            {/* User Menu */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full border">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.avatar || ""} alt={user.username} />
                                            <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.displayName || user.username}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <User className="mr-2 h-4 w-4" /> {t("navbar.profile")}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Settings className="mr-2 h-4 w-4" /> {t("navbar.settings")}
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive focus:bg-destructive/10">
                                        <LogOut className="mr-2 h-4 w-4" /> {t("navbar.logout")}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost">{t("navbar.login")}</Button>
                            </Link>
                            <Link href="/register">
                                <Button>{t("navbar.get_started")}</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}