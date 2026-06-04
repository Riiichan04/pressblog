import * as z from 'zod'

export const SendVerifySchema = () =>
    z.object({
        email: z
            .string()
            .min(1, { message: "Trường này không được để trống" })
            .pipe(z.email({ message: "Email không hợp lệ" })),
    })

export const VerifySchema = () =>
    z.object({
        code: z
            .string()
            .length(6, { message: "Mã xác thực phải bao gồm 6 ký số" })
            .regex(/^\d+$/, { message: "Mã xác thực chỉ được chứa chữ số" }),
        password: z
            .string()
            .min(6, { message: "Mật khẩu dài từ 6 - 32 ký tự" })
            .max(32, { message: "Mật khẩu dài từ 6 - 32 ký tự" }),

        confirmPassword: z
            .string()
            .min(1, { message: "Trường này không được để trống" }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Xác nhận mật khẩu không đúng",
        path: ["confirmPassword"],
    });


export type VerifyValues = z.infer<ReturnType<typeof VerifySchema>>