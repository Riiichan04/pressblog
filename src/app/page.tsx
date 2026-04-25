"use client"

import Footer from "@/components/footer";
import { LandingPage } from "@/components/landing";
import Navbar from "@/components/nav-bar";
import { useAuth } from "@/context/auth-context";

export default function HomePage() {
    const { user } = useAuth()

    return (
        <div>
            <Navbar />
            <LandingPage />
            <Footer />
        </div>
    )
}