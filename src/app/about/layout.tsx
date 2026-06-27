import Navbar from "@/components/nav-bar";
import AboutUsPage from "./page";
import Footer from "@/components/footer";

export default function AboutUsLayout() {
    return (
        <div>
            <Navbar />
            <AboutUsPage />
            <Footer />
        </div>
    )
}