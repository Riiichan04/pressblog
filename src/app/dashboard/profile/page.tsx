"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Save, Loader2 } from "lucide-react"

import { useAuth } from "@/context/auth-context"
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader"
import { toast } from "sonner"
import { updateMyProfile } from "@/services/profile-service"
import { useTranslation } from "react-i18next"

const profileSchema = z.object({
    displayName: z.string()
        .min(2, { message: "profile.validation.nameMin" })
        .max(50, { message: "profile.validation.nameMax" }),
    bio: z.string()
        .max(250, { message: "profile.validation.bioMax" })
        .optional(),
    avatar: z.string().optional(),
})
type ProfileFormValues = z.infer<typeof profileSchema>

export default function ProfilePage() {
    const { user, updateUser } = useAuth()
    const { t } = useTranslation("dashboard");
    const [isSaving, setIsSaving] = useState(false)

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ProfileFormValues>({
        resolver: zodResolver(profileSchema),
        defaultValues: { displayName: "", bio: "", avatar: "" },
    })

    useEffect(() => {
        if (user) {
            reset({
                displayName: user.displayName || "",
                bio: user.description || "",
                avatar: user.avatar || "",
            })
        }
    }, [user, reset])

    if (!user) return null

    const onSubmit = async (values: ProfileFormValues) => {
        try {
            setIsSaving(true)
            await updateMyProfile({
                displayName: values.displayName,
                bio: values.bio || "",
                avatar: values.avatar || ""
            })
            toast.success(t("profile.updateSuccess"))
            updateUser({
                displayName: values.displayName,
                description: values.bio,
                avatar: values.avatar
            })
        } catch (error: unknown) {
            toast.error((error as Error).message || t("profile.updateError"))
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">{t("profile.title")}</h1>
                <p className="text-muted-foreground mt-1">{t("profile.desc")}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("profile.avatarTitle")}</CardTitle>
                        <CardDescription>{t("profile.avatarDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-6">
                        <div className="relative group cursor-pointer">
                            <Avatar className="h-24 w-24 border-2 border-primary/10">
                                <AvatarImage src={watch("avatar") || user.avatar || ""} alt={user.username} className="object-cover" />
                                <AvatarFallback className={`${fallBackColor(user.username)} text-white text-2xl`}>
                                    {getFallback(user.displayName || user.username)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Camera className="h-6 w-6 text-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Button type="button" variant="outline" size="sm">
                                {t("profile.uploadBtn")}
                            </Button>
                            <p className="text-xs text-muted-foreground">{t("profile.avatarHint")}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t("profile.basicInfo")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="displayName">{t("profile.displayName")}</Label>
                                <Input id="displayName" placeholder={t("profile.displayNamePlaceholder")} {...register("displayName")} />
                                {errors.displayName?.message && (
                                    <p className="text-[13px] text-red-500 font-medium mt-1">
                                        {t(errors.displayName.message)}
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">{t("profile.usernameSlug")}</Label>
                                <Input defaultValue={user.username} disabled className="bg-muted" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">{t("profile.email")}</Label>
                            <Input type="email" defaultValue={user.email} disabled className="bg-muted" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">{t("profile.bio")}</Label>
                            <Textarea id="bio" placeholder={t("profile.bioPlaceholder")} className="min-h-30 resize-y" {...register("bio")} />
                            <div className="flex justify-between items-start mt-1">
                                <div className="text-[13px] text-red-500 font-medium">
                                    {errors.bio?.message && t(errors.bio.message)}
                                </div>
                                <div className="text-[10px] text-muted-foreground text-right ml-auto">
                                    {watch("bio")?.length || 0} / 250 {t("profile.chars")}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end border-t p-4 bg-muted/20">
                        <Button type="submit" disabled={isSaving} className="gap-2">
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {isSaving ? t("profile.saving") : t("profile.saveChanges")}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    )
}