"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Send, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createComment } from "@/services/comment-service"
import { useAuth } from "@/context/auth-context"

interface CommentFormProps {
    postId: number;
    parentId?: number;
    onSuccess: () => void;
    onCancel?: () => void;
}

export default function CommentForm({ postId, parentId, onSuccess, onCancel }: CommentFormProps) {
    const { t } = useTranslation("blog")
    const [content, setContent] = useState("")
    const [loading, setLoading] = useState(false)
    const { user } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!content.trim() || !user?.verified) return
        try {
            setLoading(true)
            await createComment({
                postId: postId,
                content: content.trim(),
                commentId: parentId
            })
            setContent("")
            onSuccess()
        } catch (error) {
            console.error("Error when sending comment:", error)
        } finally {
            setLoading(false)
        }
    }

    if (!user?.verified) {
        return (
            <div className="p-4 border rounded-lg bg-muted/20 text-center flex flex-col items-center gap-3">
                <p className="text-sm text-muted-foreground">{t("comments.login_required")}</p>
                <Button variant="outline" size="sm">{t("comments.login_button")}</Button>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                placeholder={t("comments.form_placeholder")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="resize-none min-h-20"
                disabled={loading}
            />
            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button type="button" variant="ghost" size="sm" onClick={onCancel} disabled={loading}>
                        Hủy
                    </Button>
                )}
                <Button
                    type="submit"
                    size="sm"
                    disabled={!content.trim() || loading}
                    className="gap-2"
                >
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {loading ? t("comments.submitting") : t("comments.submit")}
                </Button>
            </div>
        </form>
    )
}