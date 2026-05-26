import Footer from "@/components/footer";
import Navbar from "@/components/nav-bar";

export default function SearchLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Navbar />
            <div className="mt-20">
                {children}
            </div>
            <Footer />
        </div>
    )

}