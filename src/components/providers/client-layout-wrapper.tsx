"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import I18nProvider from "./i18n-provider";
import { AuthProvider } from "@/context/auth-context";
import { Provider } from "react-redux";
import { store } from "@/store/store";

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <AuthProvider>
            <Provider store={store}>
                <I18nProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster richColors closeButton />
                    </ThemeProvider>
                </I18nProvider>
            </Provider>
        </AuthProvider>
    );
}