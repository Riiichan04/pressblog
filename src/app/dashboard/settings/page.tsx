"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { KeyRound, Save, Loader2, ShieldAlert, Bell, Trash2, User, Info } from "lucide-react"
import { toast } from "sonner"
import { updatePassword } from "@/services/profile-service"
import { useAuth } from "@/context/auth-context"
import { UpdatePasswordRequest } from "@/common/types/profile"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

const passwordSchema = z.object({
    oldPassword: z.string().min(1, { message: "settings.validation.oldPassReq" }),
    newPassword: z.string().min(6, { message: "settings.validation.newPassMin" }),
    confirmPassword: z.string().min(1, { message: "settings.validation.confirmPassReq" })
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "settings.validation.passMismatch",
    path: ["confirmPassword"],
})
type PasswordFormValues = z.infer<typeof passwordSchema>

const sidebarNavItems = [
    { id: "account", labelKey: "nav.profile", icon: User },
    { id: "notifications", labelKey: "nav.notifications", icon: Bell },
    { id: "about", labelKey: "nav.about", icon: Info },
]

export default function SettingsPage() {
    const { user } = useAuth()
    const { t } = useTranslation("dashboard");
    const [activeSection, setActiveSection] = useState("account")
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordSchema),
        defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
    })

    const onSubmitPassword = async (values: PasswordFormValues) => {
        if (!user) return
        try {
            setIsChangingPassword(true)
            const inputRequest: UpdatePasswordRequest = {
                id: user.id,
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            }
            await updatePassword(inputRequest)
            toast.success(t("settings.updateSuccess"))
            reset()
        } catch (error: unknown) {
            toast.error((error as Error).message || t("settings.updateError"))
        } finally {
            setIsChangingPassword(false)
        }
    }

    if (!user) return null

    return (
        <div className="flex flex-col gap-6 max-w-5xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("settings.title")}</h1>
                <p className="text-muted-foreground mt-1">{t("settings.desc")}</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mt-4">
                <aside className="w-full md:w-1/4 lg:w-1/5">
                    <nav className="flex flex-col gap-1">
                        {sidebarNavItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activeSection === item.id
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => setActiveSection(item.id)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {t(item.labelKey)}
                                </button>
                            )
                        })}
                    </nav>
                </aside>

                <main className="flex-1">
                    {activeSection === "account" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-4 rounded-lg flex items-start gap-3">
                                <ShieldAlert className="h-5 w-5 mt-0.5 shrink-0" />
                                <div className="text-sm">
                                    <p className="font-semibold mb-1">{t("settings.protectAccount")}</p>
                                    <p>{t("settings.protectAccountDesc")}</p>
                                </div>
                            </div>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <KeyRound className="h-5 w-5" />
                                        {t("settings.changePassword")}
                                    </CardTitle>
                                    <CardDescription>{t("settings.changePasswordDesc")}</CardDescription>
                                </CardHeader>
                                <form onSubmit={handleSubmit(onSubmitPassword)}>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="oldPassword">{t("settings.oldPassword")}</Label>
                                            <Input id="oldPassword" type="password" {...register("oldPassword")} />
                                            {errors.oldPassword?.message && <p className="text-[13px] text-red-500 font-medium mt-1">{t(errors.oldPassword.message)}</p>}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="newPassword">{t("settings.newPassword")}</Label>
                                                <Input id="newPassword" type="password" {...register("newPassword")} />
                                                {errors.newPassword?.message && <p className="text-[13px] text-red-500 font-medium mt-1">{t(errors.newPassword.message)}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="confirmPassword">{t("settings.confirmPassword")}</Label>
                                                <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
                                                {errors.confirmPassword?.message && <p className="text-[13px] text-red-500 font-medium mt-1">{t(errors.confirmPassword.message)}</p>}
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="flex justify-end border-t p-4 bg-muted/20">
                                        <Button type="submit" disabled={isChangingPassword} className="gap-2">
                                            {isChangingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                            {t("settings.updateBtn")}
                                        </Button>
                                    </CardFooter>
                                </form>
                            </Card>

                            <Card className="border-red-200 dark:border-red-900/50">
                                <CardHeader>
                                    <CardTitle className="text-red-600 dark:text-red-500">{t("settings.dangerZone")}</CardTitle>
                                    <CardDescription>{t("settings.dangerZoneDesc")}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-sm">{t("settings.deleteAccount")}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{t("settings.deleteAccountDesc")}</p>
                                        </div>
                                        <Button variant="destructive" className="shrink-0 gap-2">
                                            <Trash2 className="h-4 w-4" />
                                            {t("settings.deleteBtn")}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeSection === "notifications" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        {t("settings.emailConfig")}
                                    </CardTitle>
                                    <CardDescription>{t("settings.emailConfigDesc")}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="flex items-center justify-between space-x-2">
                                        <div className="flex flex-col space-y-1">
                                            <Label className="text-base">{t("settings.newComments")}</Label>
                                            <span className="text-sm text-muted-foreground">{t("settings.newCommentsDesc")}</span>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                    <Separator />
                                    <div className="flex items-center justify-between space-x-2">
                                        <div className="flex flex-col space-y-1">
                                            <Label className="text-base">{t("settings.sysNews")}</Label>
                                            <span className="text-sm text-muted-foreground">{t("settings.sysNewsDesc")}</span>
                                        </div>
                                        <Switch />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}

                    {activeSection === "about" && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("settings.aboutTitle")}</CardTitle>
                                    <CardDescription>{t("settings.aboutDesc")}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                                    <div className="flex justify-center my-6">
                                        <div className="h-20 w-20 gap-1 rounded-2xl flex items-center justify-center text-primary font-bold text-2xl">
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
                                                "text-xl font-bold tracking-tighter transition-colors text-primary",
                                            )}>
                                                PRESS<span className={"text-foreground"}>BLOG</span>
                                            </span>
                                        </div>
                                    </div>
                                    <p>
                                        <strong>PressBlog</strong> {t("settings.aboutIntro")}
                                    </p>
                                    <ul className="list-disc pl-5 space-y-1 mt-2 text-foreground/80">
                                        <li>{t("settings.version")} <span className="font-semibold">0.0.1 (Stable Release)</span></li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}