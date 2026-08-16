"use client";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import I18nProvider from "./i18n-provider";
import { AuthProvider } from "@/context/auth-context";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import NotificationListener from "./notification-listener";
import { NotificationProvider } from "@/context/notification-context";

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
                        <NotificationProvider>
                            {children}
                            <NotificationListener />
                            <Toaster richColors closeButton />
                        </NotificationProvider>
                    </ThemeProvider>
                </I18nProvider>
            </Provider>
        </AuthProvider>
    );
}