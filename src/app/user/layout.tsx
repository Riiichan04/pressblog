import Footer from "@/components/footer";
import Navbar from "@/components/nav-bar";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}