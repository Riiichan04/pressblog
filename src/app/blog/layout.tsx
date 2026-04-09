import Navbar from "@/components/nav-bar";

export default function PostLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            {children}
        </div>
    )
}