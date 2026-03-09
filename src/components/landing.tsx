"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PostCard } from "./post-card";
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader";
import { PostDetail } from "@/common/types/post";
import { Skeleton } from "./ui/skeleton";
import { useTranslation } from "react-i18next";
import { calculateReadingTime } from "@/common/utils/post-reading";
import { getFeaturedPost, getNewestPost } from "@/services/post-service";

export function LandingPage() {
    const [newestPost, setNewestPosts] = useState<PostDetail[]>([]);
    const [featuredPost, setFeaturedPost] = useState<PostDetail | null>(null)
    const [isLoading, setIsLoading] = useState(true);
    const { t } = useTranslation(["landing", "common"]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const [newest, featured] = await Promise.all([
                    getNewestPost(),
                    getFeaturedPost()
                ]);

                setNewestPosts(newest);
                setFeaturedPost(featured);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (isLoading) {
        return <LandingPageSkeleton />;
    }

    if (newestPost.length === 0 && !featuredPost) return null;

    return (
        <div className="relative w-full overflow-x-hidden">
            {featuredPost &&
                <section className="relative h-screen w-full">
                    {/* Background Image */}
                    <div className="absolute inset-0 -z-10">
                        <Image
                            src={featuredPost.thumbnail}
                            alt="Background"
                            fill
                            priority
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
                    </div>

                    {/* Content Container */}
                    <div className="container mx-auto h-full flex flex-col justify-end pb-12 px-6">
                        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
                            <div className="w-full md:w-3/5 space-y-6">
                                <div className="flex flex-wrap gap-2">
                                    {featuredPost.tagNames.map((tag, index) => (
                                        <span key={index} className="rounded-md px-3 py-1 text-xs font-semibold bg-white/90 text-neutral-900 backdrop-blur-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-white font-bold text-3xl leading-tight">
                                        {featuredPost.name}
                                    </h3>
                                    <p className="text-gray-200 max-w-xl line-clamp-3">
                                        {featuredPost.content}
                                    </p>
                                </div>

                                <button className="group flex items-center gap-2 text-white font-medium hover:gap-4 transition-all cursor-pointer">
                                    <span>{t("main.read_more_action")}</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="flex items-center gap-4 bg-black/10 backdrop-blur-md p-3 rounded-2xl">
                                <div className="text-right">
                                    <p className="text-white font-semibold">{featuredPost.author.name}</p>
                                    <div className="flex gap-2">
                                        <div className="flex items-center justify-end gap-1.5 opacity-80">
                                            <Calendar className="text-white" size={14} />
                                            <p className="text-white text-xs">{featuredPost.updatedAt}</p>
                                        </div>
                                        <div className="bg-neutral-300 w-0.5 rounded-full"></div>
                                        <div className="flex items-center justify-end gap-1.5 opacity-80">
                                            <Clock className="text-white" size={14} />
                                            {/* Optimize later */}
                                            <p className="text-white text-xs">
                                                {calculateReadingTime(featuredPost.content)} {calculateReadingTime(featuredPost.content) > 1 ? t("post.read_time_plural") : t("post.read_time_singular")}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <Avatar className={`h-12 w-12 ring-2 ring-white/20`}>
                                    <AvatarImage src={featuredPost.author.avatar || ""} />
                                    <AvatarFallback className={`${fallBackColor(featuredPost.author.username)} text-white`}>
                                        {getFallback(featuredPost.author.name)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                        </div>
                    </div>
                </section>
            }
            <section className="container mx-auto py-24 px-4">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-2">{t("feature.newest")}</h2>
                    <div className="h-1 w-20 bg-primary rounded-full" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {newestPost.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </section>
        </div>
    );
}

function LandingPageSkeleton() {
    return (
        <div className="w-full h-screen bg-neutral-900 flex flex-col justify-end p-12">
            <div className="container mx-auto space-y-6">
                <Skeleton className="h-12 w-3/4 bg-white/10" />
                <Skeleton className="h-6 w-1/2 bg-white/10" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
                    <Skeleton className="h-64 rounded-2xl bg-white/5" />
                    <Skeleton className="h-64 rounded-2xl bg-white/5" />
                    <Skeleton className="h-64 rounded-2xl bg-white/5" />
                </div>
            </div>
        </div>
    );
}