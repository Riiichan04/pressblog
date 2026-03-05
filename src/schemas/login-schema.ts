import * as z from "zod";
import { useTranslation } from "react-i18next";

export const useLoginSchema = () => {
    const { t } = useTranslation(["auth"]);

    return z.object({
        email: z
            .string()
            .trim()
            .min(1, { message: String(t("errors.required")) })
            .pipe(
                z.email({ message: String(t("errors.invalid_email")) })
            ),

        password: z
            .string()
            .min(6, { message: String(t("errors.password_length_error")) })
    });
};

export type LoginValues = z.infer<ReturnType<typeof useLoginSchema>>;