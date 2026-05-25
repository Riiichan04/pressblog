"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { BookOpen, Loader2 } from "lucide-react"
import { useTranslation, Trans } from "react-i18next"

import { PublicPostResponse } from "@/common/types/public-user"
import { PageResponse } from "@/common/types/page-response"
import { searchPublicPosts } from "@/services/search-service"
import PublicPostCard from "@/components/public-post-card"

export default function SearchPage() {
    const searchParams = useSearchParams()
    const query = searchParams.get("q") || ""
    const { t } = useTranslation("common")

    const [postsData, setPostsData] = useState<PageResponse<PublicPostResponse> | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setLoading(false)
                return
            }
            try {
                setLoading(true)
                const res = await searchPublicPosts(query, 0, 12)
                setPostsData(res)
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
                            values={{ count: postsData?.totalElements || 0, query: query }}
                            components={{
                                bold: <strong />,
                                highlight: <span className="text-foreground font-medium" />
                            }}
                        />
                    </p>
                </div>

                {!query || postsData?.content.length === 0 ? (
                    <div className="text-center py-20 border rounded-lg bg-background shadow-sm">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                        <h3 className="text-lg font-semibold text-foreground">{t("search.no_results")}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{t("search.try_again")}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {postsData?.content.map((post) => (
                            <PublicPostCard post={post} key={post.id} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}