import * as z from 'zod'
import { TFunction } from 'i18next'

export const SendVerifySchema = (t: TFunction<"auth", undefined>) =>
    z.object({
        email: z
            .string()
            .min(1, { message: t("errors.required") })
            .pipe(z.email({ message: t("errors.invalid_email") })),
    })

export const VerifySchema = (t: TFunction<"auth", undefined>) =>
    z.object({
        code: z
            .string()
            .length(6, { message: t("errors.required") })
            .regex(/^\d+$/, { message: t("errors.required") }),
        password: z
            .string()
            .min(6, { message: t("errors.password_length_error") })
            .max(32, { message: t("errors.password_length_error") }),

        confirmPassword: z
            .string()
            .min(1, { message: t("errors.required") }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: t("errors.passwords_not_matching"),
        path: ["confirmPassword"],
    });

export type VerifyValues = z.infer<ReturnType<typeof VerifySchema>>