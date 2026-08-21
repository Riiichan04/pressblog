import Navbar from "@/components/nav-bar";

export default function NotificationLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}