"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowRight, Calendar, Clock, RefreshCcw, SearchX } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PostCard } from "./post-card";
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader";
import { PostDetail } from "@/common/types/post";
import { Skeleton } from "./ui/skeleton";
import { useTranslation } from "react-i18next";
import { calculateReadingTime } from "@/common/utils/post-reading";
import { getFeaturedPost, getNewestPost } from "@/services/post-service";
import { Button } from "./ui/button";
import { purifyBlogContent } from "@/common/utils/html-purifier";

export function LandingPage() {
    const [newestPost, setNewestPosts] = useState<PostDetail[]>([]);
    const [featuredPost, setFeaturedPost] = useState<PostDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation("landing");

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const [newest, featured] = await Promise.all([
                getNewestPost(),
                getFeaturedPost()
            ]);
            setNewestPosts(newest || []);
            setFeaturedPost(featured);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts, i18n.language]);

    if (isLoading) {
        return <LandingPageSkeleton />;
    }

    const hasNoPosts = newestPost.length === 0 && !featuredPost;

    return (
        <div className="relative w-full overflow-x-hidden bg-background">
            {hasNoPosts ? (
                <div className="min-h-screen flex items-center justify-center">
                    <EmptyPostState onRetry={fetchPosts} />
                </div>
            ) : (
                <>
                    {featuredPost && (
                        <section className="relative h-screen w-full">
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={featuredPost.thumbnail}
                                    alt="Background"
                                    fill
                                    priority
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-linear-to-r from-black/70 via-black/30 to-transparent" />
                            </div>

                            <div className="absolute inset-0 container mx-auto h-full flex flex-col justify-end pb-12 px-6 bg-transparent z-1">
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
                                            <h3 className="text-white font-bold text-3xl md:text-5xl leading-tight drop-shadow-sm">
                                                {featuredPost.name}
                                            </h3>
                                            <div className="text-gray-100 max-w-xl line-clamp-3 drop-shadow-sm">
                                                <FeaturedBlogContent content={featuredPost.content} />
                                            </div>
                                        </div>

                                        <button className="group flex items-center gap-2 text-white font-medium hover:gap-4 transition-all cursor-pointer">
                                            <span>{t("main.read_more_action")}</span>
                                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                                        <div className="text-right">
                                            <p className="text-white font-semibold">{featuredPost.author.displayName}</p>
                                            <div className="flex gap-2 justify-end">
                                                <div className="flex items-center gap-1.5 opacity-90">
                                                    <Calendar className="text-white" size={14} />
                                                    <p className="text-white text-xs">{featuredPost.updatedAt}</p>
                                                </div>
                                                <div className="bg-white/40 w-px h-3 my-auto"></div>
                                                <div className="flex items-center gap-1.5 opacity-90">
                                                    <Clock className="text-white" size={14} />
                                                    <p className="text-white text-xs lowercase">
                                                        {calculateReadingTime(featuredPost.content)} {t(calculateReadingTime(featuredPost.content) > 1 ? "post.read_time_plural" : "post.read_time_singular")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Avatar className="h-12 w-12 ring-2 ring-white/30">
                                            <AvatarImage src={featuredPost.author.avatar || ""} />
                                            <AvatarFallback className={`${fallBackColor(featuredPost.author.username)} text-white`}>
                                                {getFallback(featuredPost.author.displayName)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    <section className="container mx-auto py-24 px-4 bg-background">
                        <div className="mb-12">
                            <h2 className="text-3xl font-bold tracking-tight mb-2 text-foreground">{t("feature.newest")}</h2>
                            <div className="h-1.5 w-20 bg-primary rounded-full" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {newestPost
                                .filter(post => post.id !== featuredPost?.id)
                                .map((post) => (
                                    <PostCard key={post.id} post={post} />
                                ))}
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}

// Sửa Skeleton để chạy tốt cả Light/Dark mode
function LandingPageSkeleton() {
    return (
        <div className="w-full h-screen bg-background flex flex-col justify-end p-12">
            <div className="container mx-auto space-y-6">
                <Skeleton className="h-16 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20">
                    <Skeleton className="h-64 rounded-3xl" />
                    <Skeleton className="h-64 rounded-3xl" />
                    <Skeleton className="h-64 rounded-3xl" />
                </div>
            </div>
        </div>
    );
}

function EmptyPostState({ onRetry }: { onRetry: () => void }) {
    const { t } = useTranslation("landing");
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-background">
            <div className="bg-muted rounded-full p-6 mb-4">
                <SearchX className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">{t("empty.title")}</h3>
            <p className="text-muted-foreground max-w-sm mb-6">
                {t("empty.description")}
            </p>
            <Button
                onClick={onRetry}
                variant="outline"
                className="gap-2 rounded-full cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
            >
                <RefreshCcw className="h-4 w-4" />
                {t("main.retry_action")}
            </Button>
        </div>
    );
}

function FeaturedBlogContent({ content }: { content: string }) {
    return (
        <div dangerouslySetInnerHTML={{ __html: purifyBlogContent(content) }}></div>
    )
}