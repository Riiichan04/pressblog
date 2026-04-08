"use client";

import {
    ChevronLeft, Send, Settings, Eye,
    Languages, Bell, User, LogOut,
    Import
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/auth-context";
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { requestPublish } from "@/store/slices/post-slice";
import { cx } from "class-variance-authority";

export default function EditorNavbar() {
    const { user, logout } = useAuth();
    const { t, i18n } = useTranslation(["common"]);
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const router = useRouter()

    const dispatch = useDispatch();
    const isPublishRequested = useSelector((state: RootState) => state.post.isPublishRequested);
    const canPublish = useSelector((state: RootState) => state.post.canPublish);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setMounted(true);
        });

        return () => {
            cancelAnimationFrame(frame);
        };
    }, []);

    const toggleLanguage = () => {
        const newLang = i18n.language === "vi" ? "en" : "vi";
        i18n.changeLanguage(newLang);
        localStorage.setItem("lng", newLang);
    };

    return (
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-20 items-center justify-between px-4">

                <div className="flex items-center gap-2 md:gap-4">
                    <Button
                        variant="ghost"
                        className="flex items-center rounded-md hover:bg-muted transition-colors cursor-pointer hover:text-foreground/70"
                        onClick={() => router.back()}
                    >
                        <ChevronLeft className="size-4!" />
                        {t("navbar.back_previous")}
                    </Button>

                    <div className="flex items-center gap-2">
                        {/* <Image
                            src="/logo.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="transition-transform group-hover:scale-110 rounded-md"
                            priority
                            unoptimized
                        /> */}
                        {/* <span className="text-sm font-medium text-muted-foreground hidden lg:block">
                            {t("editor.draft", "Draft")} <span className="mx-2 opacity-50">•</span>
                            <span className="italic opacity-80 text-xs">{t("editor.saved_just_now", "Đã lưu vài giây trước")}</span>
                        </span> */}
                    </div>
                </div>

                <div className="flex items-center gap-1 md:gap-2">

                    <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                        {mounted && (
                            <div className="relative h-4 w-4">
                                <Sun className="absolute h-full w-full rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-full w-full rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            </div>
                        )}
                    </Button>

                    <Button variant="ghost" size="sm" onClick={toggleLanguage} className="h-9 gap-1 px-2 hidden sm:flex">
                        <Languages className="h-4 w-4" />
                        <span className="uppercase text-xs font-bold">{i18n.language}</span>
                    </Button>

                    <Button variant="ghost" size="sm" className="h-9 text-muted-foreground hover:text-foreground hidden lg:flex gap-2">
                        <Eye className="h-4 w-4" />
                        {t("editor.preview", "Preview")}
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => document.getElementById("hidden-markdown-import")?.click()}
                        className="h-9 text-muted-foreground hover:text-foreground hidden lg:flex gap-2"
                    >
                        <Import className="h-4 w-4 mr-2" />
                        Import
                    </Button>

                    {/* <Button
                        className="h-9 rounded-md px-4 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-all font-semibold"
                        onClick={() => dispatch(requestPublish())}
                        disabled={isPublishRequested}
                    >
                        <Send className="h-4 w-4 mr-2" />
                        {isPublishRequested ? t("editor.publishing") : t("editor.publish")}
                    </Button> */}

                    <Button
                        disabled={!canPublish || isPublishRequested}
                        onClick={() => dispatch(requestPublish())}
                        className={cx(
                            "h-9 rounded-md px-4 font-semibold transition-all",
                            !canPublish ? "opacity-50 cursor-not-allowed bg-muted text-muted-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                    >
                        <Send className="h-4 w-4 mr-2" />
                        {isPublishRequested ? t("editor.publishing") : t("editor.publish")}
                    </Button>

                    {user && (
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-9 w-9 relative hidden sm:flex">
                                <Bell className="h-4 w-4" />
                            </Button>

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
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}