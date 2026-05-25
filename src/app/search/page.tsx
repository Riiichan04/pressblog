"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { BookOpen, Loader2, User as UserIcon } from "lucide-react"
import { useTranslation, Trans } from "react-i18next"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { PublicPostResponse, PublicUserProfileResponse } from "@/common/types/public-user"
import { PageResponse } from "@/common/types/page-response"
import { searchPublicPosts, searchPublicAuthors } from "@/services/search-service"
import PublicPostCard from "@/components/public-post-card"
import PublicUserCard from "@/components/user-card"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const { t } = useTranslation("common")

    const [postsData, setPostsData] = useState<PageResponse<PublicPostResponse> | null>(null)
    const [authorsData, setAuthorsData] = useState<PageResponse<PublicUserProfileResponse> | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setLoading(false)
                return
            }
            try {
                setLoading(true)
                const [postsRes, authorsRes] = await Promise.all([
                    searchPublicPosts(query, 0, 12),
                    searchPublicAuthors(query, 0, 12)
                ])
                setPostsData(postsRes)
                setAuthorsData(authorsRes)
            } catch (error) {
                console.error("Lỗi tìm kiếm:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchResults()
    }, [query])

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-sm font-medium">{t("search.searching")}</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/20 py-10 px-4 md:px-8">
            <div className="max-w-6xl mx-auto space-y-8">

                <div className="space-y-2 border-b pb-4">
                    <h1 className="text-3xl font-bold tracking-tight">{t("search.title")}</h1>
                    <p className="text-muted-foreground">
                        <Trans
                            t={t}
                            i18nKey="search.results_found"
                            values={{
                                count: (postsData?.totalElements || 0) + (authorsData?.totalElements || 0),
                                query: query
                            }}
                            components={{
                                bold: <strong />,
                                highlight: <span className="text-foreground font-medium" />
                            }}
                        />
                    </p>
                </div>

                {!query || (postsData?.content.length === 0 && authorsData?.content.length === 0) ? (
                    <div className="text-center py-20 border rounded-lg bg-background shadow-sm">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                        <h3 className="text-lg font-semibold text-foreground">{t("search.no_results")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{t("search.try_again")}</p>
                    </div>
                ) : (
                    <Tabs defaultValue="posts" className="w-full">
                        <TabsList className="mb-6">
                            <TabsTrigger value="posts" className="flex gap-2">
                                <BookOpen className="h-4 w-4" />
                                {t("search.post_tab")} ({postsData?.totalElements || 0})
                            </TabsTrigger>
                            <TabsTrigger value="authors" className="flex gap-2">
                                <UserIcon className="h-4 w-4" />
                                {t("search.user_tab")} ({authorsData?.totalElements || 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="posts" className="space-y-6">
                            {postsData?.content.length === 0 ? (
                                <p className="text-muted-foreground text-center py-10">{t("search.no_results_post")}</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {postsData?.content.map((post) => (
                                        <PublicPostCard post={post} key={post.id} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="authors" className="space-y-6">
                            {authorsData?.content.length === 0 ? (
                                <p className="text-muted-foreground text-center py-10">{t("search.no_results_user")}</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {authorsData?.content.map((author) => (
                                        <PublicUserCard author={author} key={author.username} />
                                    ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    )
}