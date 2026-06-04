"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VerifySchema } from "@/schemas/verify-schema";
import { sendVerifyAccountOtp, verifyAccount } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";

export default function VerifyAccountPage() {
    const router = useRouter()
    const { user, updateUser } = useAuth()

    const [isVerifyLoading, setIsVerifyLoading] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [isSendingEmail, setIsSendingEmail] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const verifyForm = useForm({
        resolver: zodResolver(VerifySchema()),
        defaultValues: {
            code: "",
            password: "DummyPasswd", 
            confirmPassword: "DummyPasswd"
        }
    })

    useEffect(() => {
        if (!user) {
            router.push("/login");
        } else if (user.isVerified) {
            toast.info("Tài khoản của bạn đã được xác thực!");
            router.push("/");
        }
    }, [user, router]);

    const handleResendOtp = async () => {
        if (!user?.email) return;
        setIsSendingEmail(true)
        try {
            const response = await sendVerifyAccountOtp(user.email)
            if (response.result) {
                setCountdown(60);
                toast.success("Mã xác thực mới đã được gửi vào email của bạn")
            } else {
                toast.error("Lỗi khi gửi mã", { description: response.message })
            }
        } catch {
            toast.error("Lỗi khi gửi lại mã")
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
                toast.success("Xác thực tài khoản thành công")

                updateUser({ isVerified: true });

                setTimeout(() => router.push("/"), 2000)
            } else {
                toast.error("Xác thực thất bại", { description: response.message })
            }
        } catch {
            toast.error("Có lỗi xảy ra")
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

    if (!user || user.isVerified) return null;

    return (
        <div className="w-full">
            <div className="space-y-2 mb-8 text-center">
                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Xác thực tài khoản</h1>
                <p className="text-gray-500 text-sm">
                    Mã xác thực đã được gửi đến email <b>{user.email}</b>
                </p>
            </div>

            <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                        <label className="text-sm font-medium">Mã xác thực (OTP)</label>
                        <button
                            type="button"
                            disabled={isSendingEmail || countdown > 0}
                            onClick={handleResendOtp}
                            className="text-xs text-blue-600 hover:underline disabled:text-gray-400 cursor-pointer"
                        >
                            {countdown > 0 ? `Gửi lại sau ${countdown}s` : "Nhận mã OTP"}
                        </button>
                    </div>
                    <Input
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={6}
                        {...verifyForm.register("code")}
                        className={`py-6 text-center text-2xl tracking-[1em] font-bold ${verifyForm.formState.errors.code ? "border-red-500" : ""}`}
                    />
                    {verifyForm.formState.errors.code && (
                        <p className="text-xs text-red-500 text-center">{verifyForm.formState.errors.code.message as string}</p>
                    )}
                </div>

                <Button
                    type="submit"
                    className="w-full mt-4 py-4.5 cursor-pointer"
                    disabled={isVerifyLoading || isSuccess}
                >
                    {isVerifyLoading ? <Loader2 className="animate-spin mr-2" /> : "Xác nhận"}
                </Button>

                <Button
                    variant="ghost"
                    type="button"
                    className="w-full cursor-pointer"
                    onClick={() => router.push("/")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Bỏ qua & Về trang chủ
                </Button>
            </form>
        </div>
    )
}