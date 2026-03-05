import { imageLoader } from "@/common/utils/image-loader";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen">
            <div className="bg-neutral-50 h-screen hidden lg:flex flex-2 relative">
                <Image
                    loader={imageLoader}
                    sizes="100vw"
                    src={`/auth-media_dfgm8a.webp`}
                    alt="Login media"
                    fill
                    quality={30}
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-r from-black/40 to-transparent" />
            </div>
            <div className="flex-1 py-4 px-8 flex items-center">
                {children}
            </div>
        </div>
    )
}