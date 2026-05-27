"use client"

import { useCallback, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Loader2, MessageSquare } from "lucide-react"

import { CommentResponse } from "@/common/types/comment"
import { getRootComments } from "@/services/comment-service"
import CommentItem from "./comment-item"
import CommentForm from "./comment-form"

interface CommentSectionProps {
    postId: number
}

export default function CommentSection({ postId }: CommentSectionProps) {
    const { t } = useTranslation("blog")
    const [comments, setComments] = useState<CommentResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [totalElements, setTotalElements] = useState(0)

    const fetchComments = useCallback(async () => {
        try {
            setLoading(true)
            const res = await getRootComments(postId, 0, 10)
            setComments(res.content)
            setTotalElements(res.totalElements)
        } catch (error) {
            console.error("Error when sending comment:", error)
        } finally {
            setLoading(false)
        }
    }, [postId])

    useEffect(() => {
        fetchComments()
    }, [postId, fetchComments])

    return (
        <section className="mt-12 pt-8 border-t border-border/50">
            <div className="flex items-center gap-2 mb-8">
                <h3 className="text-2xl font-bold">{t("comments.title")}</h3>
                <span className="bg-muted text-muted-foreground text-sm py-0.5 px-2.5 rounded-full font-medium">
                    {totalElements}
                </span>
            </div>

            <div className="mb-8 p-4 border border-dashed rounded-lg text-center text-muted-foreground bg-muted/20 text-sm">
                <CommentForm
                    postId={postId}
                    onSuccess={fetchComments}
                />
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-3" />
                    <p className="text-sm">{t("comments.loading")}</p>
                </div>
            ) : comments.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center">
                    <MessageSquare className="h-10 w-10 text-muted-foreground/30 mb-3" />
                    <p className="text-muted-foreground text-sm">
                        {t("comments.no_comments")}
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    {comments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} />
                    ))}
                </div>
            )}
        </section>
    )
}