"use client"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-prodiver";
import "@/lib/i18n";

import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

type RootLayoutProps = {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <>
            <html
                lang="en"
                suppressHydrationWarning
                className={`${inter.className} antialiased`}
            >
                <head />
                <body>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster richColors closeButton />
                    </ThemeProvider>
                </body>
            </html>
        </>
    )
}