"use client"

import { useEffect, useState, use } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Eye, Loader2, ChevronLeft, ChevronRight, BookOpen } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"
import Image from "next/image"

import { getPublicProfile, getPublicUserPosts } from "@/services/public-user-service"
import { PublicUserProfileResponse, PublicPostResponse } from "@/common/types/public-user"
import { PageResponse } from "@/common/types/page-response"
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader"

interface AuthorPageProps {
    params: Promise<{ username: string }>
}

export default function AuthorPublicPage({ params }: AuthorPageProps) {
    const { username } = use(params)
    const { t } = useTranslation("author")

    const [profile, setProfile] = useState<PublicUserProfileResponse | null>(null)
    const [postsData, setPostsData] = useState<PageResponse<PublicPostResponse> | null>(null)

    const [loading, setLoading] = useState(true)
    const [pageIndex, setPageIndex] = useState(0)

    useEffect(() => {
        const fetchAuthorData = async () => {
            try {
                setLoading(true)
                const [profileRes, postsRes] = await Promise.all([
                    getPublicProfile(username),
                    getPublicUserPosts(username, pageIndex, 9)
                ])
                console.log(profileRes)
                console.log(postsRes)
                setProfile(profileRes)
                setPostsData(postsRes)
            } catch (error: unknown) {
                toast.error((error as Error).message || t("author.fetchError"))
            } finally {
                setLoading(false)
            }
        };

        if (username) {
            fetchAuthorData()
        }
    }, [username, pageIndex, t])

    if (loading && !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-sm font-medium">Loading profile...</p>
            </div>
        )
    }

    if (!profile) return null

    return (
        <div className="min-h-screen bg-muted/20 py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-10">

                <Card className="overflow-hidden border-none shadow-md bg-background">
                    <div className="h-32 bg-linear-to-r from-primary/20 to-primary/5 dark:from-primary/10 dark:to-background" />
                    <CardContent className="relative pt-0 pb-6 px-6 md:px-8 flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                        <div className="-mt-16 relative">
                            <Avatar className="h-28 w-28 border-4 border-background shadow-lg">
                                <AvatarImage src={profile.avatar || ""} alt={profile.username} className="object-cover" />
                                <AvatarFallback className={`${fallBackColor(profile.username)} text-white text-3xl`}>
                                    {getFallback(profile.displayName || profile.username)}
                                </AvatarFallback>
                            </Avatar>
                        </div>

                        <div className="flex-1 space-y-1 mt-2 sm:mt-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight text-foreground">{profile.displayName}</h1>
                                <span className="text-sm text-muted-foreground font-mono">@{profile.username}</span>
                            </div>
                            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                                {profile.bio || "No biography provided yet."}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-1">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>{t("author.joined")} {new Date(profile.joinedAt).toLocaleDateString('vi-VN')}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 border-b pb-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <h2 className="text-xl font-bold text-foreground">{t("author.postsTitle")}</h2>
                    </div>

                    {postsData?.content.length === 0 ? (
                        <div className="text-center py-16 border rounded-lg bg-background text-muted-foreground shadow-sm">
                            <p className="text-sm font-medium">{t("author.noPosts")}</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {postsData?.content.map((post) => (
                                <Card key={post.id} className="flex flex-col overflow-hidden h-full hover:shadow-md transition-shadow group">
                                    <div className="relative aspect-video w-full overflow-hidden bg-muted">
                                        {post.thumbnail ? (
                                            <Image
                                                src={post.thumbnail}
                                                alt={post.title}
                                                fill
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-primary/5">
                                                <BookOpen className="h-8 w-8 opacity-40" />
                                            </div>
                                        )}
                                    </div>

                                    <CardHeader className="p-4 space-y-1.5 flex-1">
                                        <CardTitle className="text-base font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                                            <Link href={`/blog/${post.slug}`}>
                                                {post.title}
                                            </Link>
                                        </CardTitle>
                                        <CardDescription className="text-xs line-clamp-3 leading-relaxed">
                                            {post.summary || ""}
                                        </CardDescription>
                                    </CardHeader>

                                    <CardFooter className="p-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground bg-muted/5">
                                        <div className="flex items-center gap-3">
                                            <span className="font-medium">
                                                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                                            </span>
                                            <span className="flex items-center gap-1 font-medium">
                                                <Eye className="h-3.5 w-3.5" />
                                                {post.viewCount} {t("author.views")}
                                            </span>
                                        </div>
                                        <Link href={`/blog/${post.slug}`} className="text-primary font-semibold hover:underline">
                                            {t("author.readMore")} →
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}

                    {postsData && postsData.totalPages > 1 && (
                        <div className="flex items-center justify-between px-2 py-4 border-t mt-4">
                            <div className="text-sm text-muted-foreground">
                                {t("author.page")} {postsData.number + 1} / {postsData.totalPages}
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPageIndex(p => Math.max(0, p - 1))}
                                    disabled={postsData.number === 0 || loading}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    {t("author.prev")}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPageIndex(p => Math.min(postsData.totalPages - 1, p + 1))}
                                    disabled={postsData.number === postsData.totalPages - 1 || loading}
                                >
                                    {t("author.next")}
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}