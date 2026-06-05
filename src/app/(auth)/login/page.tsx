"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { useLoginSchema, LoginValues } from "@/schemas/login-schema";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { FieldSeparator } from "@/components/ui/field";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthResponse } from "@/common/types/auth";
import { handleLogin } from "@/services/auth-service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";

export default function LoginForm() {
    const { t } = useTranslation(["auth"]);
    const loginSchema = useLoginSchema();
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { login } = useAuth()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = async (data: LoginValues) => {
        setIsLoading(true);
        try {
            const response: AuthResponse = await handleLogin(data);
            if (response.result === true && response.authDto) {
                login(response.authDto)

                toast.success(t("login.success_title"));
                setTimeout(() => {
                    router.push("/")
                }, 2000)
            } else {
                toast.error(t("errors.login_failed"), {
                    description: t("errors.login_failed_reason")
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const serverMessage = error.response?.data?.message || t("errors.something_went_wrong");

                toast.error(t("errors.login_failed"), {
                    description: serverMessage,
                });
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="space-y-1 text-center my-8">
                <h1 className="text-2xl font-bold">{t("login.title")}</h1>
                <p className="text-gray-500 text-sm">{t("login.subtitle")}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium">{t("login.email_label")}</label>
                    <Input
                        type="email"
                        placeholder="name@example.com"
                        {...register("email")}
                        className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="space-y-1">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">{t("login.password_label")}</label>
                        <button type="button" className="cursor-pointer text-xs hover:underline" onClick={() => router.push("/forgot-password")}>
                            {t("login.forgot_password")}
                        </button>
                    </div>
                    <Input
                        type="password"
                        {...register("password")}
                        className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                    />
                    {errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 cursor-pointer"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {t("login.processing")}
                        </>
                    ) : (
                        t("login.btn_submit")
                    )}
                </Button>

                <FieldSeparator className="my-4">{t("login.seperator")}</FieldSeparator>

                <Button className="w-full my-4 flex cursor-pointer" variant="outline" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 30 30">
                        <path d="M 15.003906 3 C 8.3749062 3 3 8.373 3 15 C 3 21.627 8.3749062 27 15.003906 27 C 25.013906 27 27.269078 17.707 26.330078 13 L 25 13 L 22.732422 13 L 15 13 L 15 17 L 22.738281 17 C 21.848702 20.448251 18.725955 23 15 23 C 10.582 23 7 19.418 7 15 C 7 10.582 10.582 7 15 7 C 17.009 7 18.839141 7.74575 20.244141 8.96875 L 23.085938 6.1289062 C 20.951937 4.1849063 18.116906 3 15.003906 3 z"></path>
                    </svg>
                    <span>
                        {t("login.login_google")}
                    </span>
                </Button>

                <p className="text-center text-sm text-gray-600">
                    {t("login.no_account")}
                    <Link href="/register" className="ms-1 underline cursor-pointer hover:text-gray-800">
                        {t("login.no_account_action")}
                    </Link>
                </p>
            </form>
        </div>
    );
}