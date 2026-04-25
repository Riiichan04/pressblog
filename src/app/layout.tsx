import { Inter } from "next/font/google";
import ClientLayoutWrapper from "@/components/providers/client-layout-wrapper";
import { Metadata } from "next";
import "./globals.css"

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

export const metadata: Metadata = {
    title: {
        default: "PressBlog - Nơi chia sẻ kiến thức và cuộc sống",
        template: "%s | PressBlog"
    },
    description: "Blog chia sẻ về công nghệ và cuộc sống",
};

type RootLayoutProps = {
    children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={`${inter.className} antialiased`}
        >
            <head />
            <body>
                <ClientLayoutWrapper>
                    {children}
                </ClientLayoutWrapper>
            </body>
        </html>
    )
}