import Footer from "@/components/footer";
import Navbar from "@/components/nav-bar";

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}