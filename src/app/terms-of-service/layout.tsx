import Footer from "@/components/footer";
import Navbar from "@/components/nav-bar";

export default function TermsOfServiceLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            {children}
            <Footer />
        </div>
    )
}