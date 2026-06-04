"use client"

import { PasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendVerifySchema, VerifySchema } from "@/schemas/verify-schema";
import { sendResetPasswordOtp, verifyResetPassword } from "@/services/auth-service";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
    const router = useRouter()

    const sendVerifySchema = SendVerifySchema()
    const verifySchema = VerifySchema()

    const [step, setStep] = useState(1)
    const [email, setEmail] = useState("")
    const [isVerifyLoading, setIsVerifyLoading] = useState(false)
    const [countdown, setCountdown] = useState(0);
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false)

    const sendVerifyForm = useForm({
        resolver: zodResolver(sendVerifySchema),
        defaultValues: { email: "" }
    })

    const verifyForm = useForm({
        resolver: zodResolver(verifySchema),
        defaultValues: { code: "", password: "", confirmPassword: "" }
    })

    const onSendEmail = async (data: { email: string }) => {
        setIsSendingEmail(true)
        try {
            const response = await sendResetPasswordOtp(data.email)
            if (response.result) {
                setEmail(data.email)
                setStep(2)
                setCountdown(60);
            }
            else {
                toast.error("Yêu cầu thất bại", { description: response.message || "" })
            }
        }
        catch {
            toast.error("Có lỗi xảy ra, hãy thử lại sau")
        }
        finally {
            setIsSendingEmail(false)
        }
    }

    const onVerify = async (data: { code: string, password: string }) => {
        try {
            setIsVerifyLoading(true)
            const response = await verifyResetPassword({
                email: email,
                code: data.code,
                newPassword: data.password
            });

            if (response.result) {
                setIsSuccess(true)
                toast.success("Đổi mật khẩu thành công", { description: "Chuyển sang trang đăng nhập sau 2 giây" })
                setTimeout(() => {
                    router.push("/login")
                }, 2000)
            }
            else {
                toast.error("Đổi mật khẩu thất bại", { description: response.message || "" })
            }
            setIsVerifyLoading(false)
        }
        catch {
            toast.error("Có lỗi xảy ra, hãy thử lại sau")
            setIsVerifyLoading(false)
        }
    }

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    return (
        <div className="w-full">
            <div className="absolute top-4 right-4">
                <div className="flex justify-end gap-2">
                    <Button
                        variant={"ghost"}
                        className="cursor-pointer"
                        onClick={() => router.push("/login")}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Trở về đăng nhập
                    </Button>
                </div>
            </div>

            <div className="space-y-1 text-center my-8">
                <h1 className="text-2xl font-bold">Quên mật khẩu</h1>
                <p className="text-gray-500 text-sm">Nhập email và mã xác nhận của bạn để lấy lại mật khẩu</p>
            </div>

            <form onSubmit={sendVerifyForm.handleSubmit(onSendEmail)} className="space-y-6">
                <div className="space-y-1">
                    <label className="text-sm font-medium">Địa chỉ Email</label>
                    <div className="flex gap-2 items-center">
                        <Input
                            type="email"
                            readOnly={step === 2}
                            placeholder="name@example.com"
                            {...sendVerifyForm.register("email")}
                            className={`py-4 mt-1 ${sendVerifyForm.formState.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        <Button
                            type="submit"
                            className="cursor-pointer py-4 min-w-20"
                            disabled={isSendingEmail || countdown > 0 || step === 2}
                        >
                            {isSendingEmail ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : countdown > 0 ? (
                                `(${countdown}s)`
                            ) : (
                                "Gửi OTP"
                            )}
                        </Button>
                    </div>
                    {sendVerifyForm.formState.errors.email && (
                        <p className="text-xs text-red-500 mt-1">{sendVerifyForm.formState.errors.email.message}</p>
                    )}
                </div>
            </form>

            {step === 2 &&
                <form onSubmit={verifyForm.handleSubmit(onVerify)} className="space-y-6 mt-8">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Mã xác thực</label>
                        <Input
                            inputMode="numeric" pattern="[0-9]*"
                            type="text"
                            {...verifyForm.register("code")}
                            className={`py-4 mt-1 tracking-widest text-center text-lg font-bold ${verifyForm.formState.errors.code ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        {verifyForm.formState.errors.code && (
                            <p className="text-xs text-red-500 mt-1">{verifyForm.formState.errors.code.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Nhập mật khẩu mới</label>
                        <PasswordInput
                            {...verifyForm.register("password")}
                            className={`py-4 mt-1 ${verifyForm.formState.errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                        />
                        {verifyForm.formState.errors.password && (
                            <p className="text-xs text-red-500 mt-1">{verifyForm.formState.errors.password.message}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-sm font-medium">Xác nhận mật khẩu</label>
                        <PasswordInput
                            {...verifyForm.register("confirmPassword")}
                            className={`py-4 mt-1 ${verifyForm.formState.errors.confirmPassword ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        />
                        {verifyForm.formState.errors.confirmPassword && (
                            <p className="text-xs text-destructive mt-1">{verifyForm.formState.errors.confirmPassword.message}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        className="w-full mt-4 cursor-pointer py-4.5"
                        disabled={isVerifyLoading || isSuccess}
                    >
                        {isVerifyLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang đổi mật khẩu
                            </>
                        ) : (
                            "Đổi mật khẩu"
                        )}
                    </Button>
                </form>
            }
        </div>
    )
}