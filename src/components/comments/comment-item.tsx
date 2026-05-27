"use client"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { MessageCircle, ChevronDown, ChevronUp, Loader2 } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { CommentResponse } from "@/common/types/comment"
import { getReplies } from "@/services/comment-service"
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader"
import CommentForm from "./comment-form"

export default function CommentItem({ comment }: { comment: CommentResponse }) {
    const { t, i18n } = useTranslation("blog")
    const [replies, setReplies] = useState<CommentResponse[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isReplying, setIsReplying] = useState(false)
    const [loading, setLoading] = useState(false)

    const [localReplyCount, setLocalReplyCount] = useState(comment.replyCount)

    const loadReplies = async () => {
        setLoading(true)
        try {
            const res = await getReplies(comment.id, 0)
            setReplies(res.content)
        } catch (error) {
            console.error("Lỗi tải replies:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleReplies = async () => {
        if (!isOpen && replies.length === 0) {
            await loadReplies()
        }
        setIsOpen(!isOpen)
    }

    const localeString = i18n.resolvedLanguage === "vi" ? "vi-VN" : "en-US"

    return (
        <div className="flex flex-col space-y-3">
            <div className="flex gap-3">
                <Avatar className="h-9 w-9 mt-1">
                    <AvatarImage src={comment.authorAvatar || ""} />
                    <AvatarFallback className={`${fallBackColor(comment.authorDisplayName)} text-white text-xs`}>
                        {getFallback(comment.authorDisplayName)}
                    </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{comment.authorDisplayName}</span>
                        {comment.createdAt && (
                            <span className="text-xs text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString(localeString)}
                            </span>
                        )}
                    </div>

                    <div className="text-sm text-foreground/90 whitespace-pre-wrap">
                        {comment.content}
                    </div>

                    <div className="flex items-center gap-4 pt-1">
                        <button
                            onClick={() => setIsReplying(!isReplying)}
                            className="text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors"
                        >
                            <MessageCircle className="h-3.5 w-3.5" /> {t("comments.reply")}
                        </button>
                    </div>
                </div>
            </div>

            <div className="ml-11">
                {isReplying && (
                    <div className="mt-2 mb-4">
                        <CommentForm
                            postId={comment.postId}
                            parentId={comment.id}
                            onSuccess={async () => {
                                setIsReplying(false)
                                setLocalReplyCount(prev => prev + 1) 
                                setIsOpen(true) 
                                await loadReplies() 
                            }}
                            onCancel={() => setIsReplying(false)}
                        />
                    </div>
                )}
            </div>

            {(localReplyCount > 0 || replies.length > 0) && (
                <div className="ml-11 border-l-2 border-muted/50 pl-4 mt-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs text-primary font-bold hover:bg-primary/5 rounded-full px-3 mb-2"
                        onClick={handleToggleReplies}
                    >
                        {loading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                        ) : isOpen ? (
                            <ChevronUp className="h-3.5 w-3.5 mr-1.5" />
                        ) : (
                            <ChevronDown className="h-3.5 w-3.5 mr-1.5" />
                        )}
                        {isOpen
                            ? t("comments.hide_replies")
                            : t("comments.view_replies", { count: localReplyCount })
                        }
                    </Button>

                    {isOpen && (
                        <div className="space-y-5 mt-2 animate-in slide-in-from-top-2 duration-300">
                            {replies.map(reply => (
                                <CommentItem key={reply.id} comment={reply} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}