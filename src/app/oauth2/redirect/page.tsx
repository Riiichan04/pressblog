"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import axios from "axios";
import { apiUrl } from "@/common/constants/api-url";
import { AuthDto } from "@/common/types/auth";
import { useTranslation } from "react-i18next";

export default function OAuth2RedirectPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const { login } = useAuth();

    const { t } = useTranslation("auth");

    const isFetching = useRef(false);

    useEffect(() => {
        if (!token || isFetching.current) {
            if (!token && !isFetching.current) {
                toast.error(t("oauth2.missing_token"));
                router.push("/login");
            }
            return;
        }

        const fetchProfileAndLogin = async () => {
            isFetching.current = true;
            try {
                const res = await axios.get<AuthDto>(`${apiUrl}/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const authData = res.data;
                const userData: AuthDto = { ...authData, jwtToken: token };

                login(userData);

                toast.success(t("oauth2.success"));
                router.push("/");
            } catch {
                toast.error(t("oauth2.fetch_failed"));
                router.push("/login");
            }
        };

        fetchProfileAndLogin();
    }, [token, login, router, t]);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium">{t("oauth2.syncing")}</p>
        </div>
    );
}