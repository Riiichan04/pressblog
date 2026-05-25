import * as z from "zod";
import { useTranslation } from "react-i18next";

export const useRegisterSchema = () => {
    const { t } = useTranslation(["auth"]);

    return z
        .object({
            email: z
                .string()
                .min(1, { message: String(t("errors.required")) })
                .pipe(z.email({ message: String(t("errors.invalid_email")) })),

            username: z
                .string()
                .min(3, { message: String(t("errors.username_length_error")) })
                .max(20, { message: String(t("errors.username_length_error")) })
                .regex(/^[a-zA-Z0-9_]+$/, { message: String(t("errors.username_format_error")) }),

            password: z
                .string()
                .min(6, { message: String(t("errors.password_length_error")) })
                .max(32, { message: String(t("errors.password_length_error")) }),

            confirmPassword: z
                .string()
                .min(1, { message: String(t("errors.required")) }),

            acceptTerms: z
                .boolean()
                .refine((val) => val === true, {
                    message: String(t("errors.terms_required")),
                }),
        })
        .refine((data) => data.password === data.confirmPassword, {
            message: String(t("errors.passwords_not_matching")),
            path: ["confirmPassword"],
        });
};

export type RegisterValues = z.infer<ReturnType<typeof useRegisterSchema>>;