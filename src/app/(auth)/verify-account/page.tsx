"use client"

import { Button } from "@/components/ui/button";
import { VerifySchema } from "@/schemas/verify-schema";
import { sendVerifyAccountOtp, verifyAccount } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { useTranslation } from "react-i18next";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function VerifyAccountPage() {
    const router = useRouter()
    const { user, updateUser } = useAuth()
    const { t } = useTranslation(["auth"]);

    const [isVerifyLoading, setIsVerifyLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [isSendingEmail, setIsSendingEmail] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const verifyForm = useForm({
        resolver: zodResolver(VerifySchema(t)),
        defaultValues: {
            code: "",
            password: "DummyPasswd",
            confirmPassword: "DummyPasswd"
        }
    })

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else if (user.verified) {
            toast.info(t("verify.alreadyVerified"));
            router.push("/");
        }
    }, [user, router, t]);

    const handleResendOtp = async () => {
        if (!user?.email) return;
        setIsSendingEmail(true)
        try {
            const response = await sendVerifyAccountOtp(user.email)
            if (response.result) {
                setCountdown(60);
                toast.success(t("verify.sendSuccess"))
            } else {
                toast.error(t("errors.something_went_wrong"), { description: response.message })
            }
        } catch {
            toast.error(t("errors.something_went_wrong"))
        } finally {
            setIsSendingEmail(false)
        }
    }

    const onVerify = async (data: { code: string }) => {
        if (!user?.email) return;
        try {
            setIsVerifyLoading(true)
            const response = await verifyAccount({ email: user.email, code: data.code })
            if (response.result) {
                setIsSuccess(true)
                toast.success(t("verify.alreadyVerified"))

                updateUser({ verified: true });

                setTimeout(() => router.push("/"), 2000)
            } else {
                toast.error(t("errors.something_went_wrong"))
            }
        } catch {
            toast.error(t("errors.something_went_wrong"))
        } finally {
            setIsVerifyLoading(false)
        }
    }

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    if (!user || user.verified) return null;

    return (
        <div className="w-full">
            <div className="space-y-2 mb-8 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">{t("verify.title")}</h1>
                <p className="text-gray-500 text-sm">
                    {t("verify.description")} <b>{user.email}</b>
                </p>
            </div>

            <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-medium">{t("verify.otpLabel")}</label>
                        <button
                            type="button"
                            disabled={isSendingEmail || countdown > 0}
                            onClick={handleResendOtp}
                            className="text-xs text-blue-600 hover:underline disabled:text-gray-400 cursor-pointer"
                        >
                            {countdown > 0 ? t("verify.resendIn", { time: countdown }) : t("verify.resendBtn")}
                        </button>
                    </div>
                    <div className="flex justify-center mt-2">
                        <Controller
                            control={verifyForm.control}
                            name="code"
                            render={({ field }) => (
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} className={`w-12 h-14 text-xl ${verifyForm.formState.errors.code ? "border-red-500" : ""}`} />
                                        <InputOTPSlot index={1} className={`w-12 h-14 text-xl ${verifyForm.formState.errors.code ? "border-red-500" : ""}`} />
                                        <InputOTPSlot index={2} className={`w-12 h-14 text-xl ${verifyForm.formState.errors.code ? "border-red-500" : ""}`} />
                                        <InputOTPSlot index={3} className={`w-12 h-14 text-xl ${verifyForm.formState.errors.code ? "border-red-500" : ""}`} />
                                        <InputOTPSlot index={4} className={`w-12 h-14 text-xl ${verifyForm.formState.errors.code ? "border-red-500" : ""}`} />
                                        <InputOTPSlot index={5} className={`w-12 h-14 text-xl ${verifyForm.formState.errors.code ? "border-red-500" : ""}`} />
                                    </InputOTPGroup>
                                </InputOTP>
                            )}
                        />
                    </div>
                    {verifyForm.formState.errors.code && (
                        <p className="text-xs text-red-500 text-center">{verifyForm.formState.errors.code.message as string}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 py-4.5 cursor-pointer"
                    disabled={isVerifyLoading || isSuccess}
                >
                    {isVerifyLoading ? <Loader2 className="animate-spin mr-2" /> : t("verify.submitBtn")}
                </Button>

                <Button
                    variant="ghost"
                    type="button"
                    className="w-full cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t("verify.skipBtn")}
                </Button>
            </form>
        </div>
    )
}