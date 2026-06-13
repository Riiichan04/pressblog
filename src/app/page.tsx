"use client"

import Footer from "@/components/footer";
import { HomePageComponent } from "@/components/home";
import LandingPageComponent from "@/components/landing";
import Navbar from "@/components/nav-bar";
import { useAuth } from "@/context/auth-context";

export default function HomePage() {
    const { user } = useAuth()

    return (
        <div>
            <Navbar />
            {user ?
                <HomePageComponent />
                : <LandingPageComponent />
            }
            <Footer />
        </div>
    )
}