import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AdminCommentResponse } from "@/common/types/admin";
import { useTranslation } from "react-i18next";
import { ReactNode } from "react";

interface CommentDetailDialogProps {
    comment: AdminCommentResponse | null;
    onClose: () => void;
    getStatusBadge: (status: string, isDeleted: boolean) => ReactNode;
}

export function CommentDetailDialog({ comment, onClose, getStatusBadge }: CommentDetailDialogProps) {
    const { t, i18n } = useTranslation("admin");

    if (!comment) return null;

    return (
        <Dialog open={!!comment} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-150">
                <DialogHeader>
                    <DialogTitle>{t("comments.detail.title")}</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm bg-muted/30 p-3 rounded-lg border">
                        <div>
                            <span className="text-muted-foreground font-medium">{t("comments.detail.author")}</span>
                            <span className="font-semibold ml-1">{comment.authorName}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground font-medium">{t("comments.detail.status")}</span>
                            <span className="ml-2">{getStatusBadge(comment.status, comment.isDeleted)}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-muted-foreground font-medium">{t("comments.detail.post")}</span>
                            <span className="ml-1">{comment.postName || comment.postSlug}</span>
                        </div>
                        <div className="col-span-2">
                            <span className="text-muted-foreground font-medium">{t("comments.detail.date")}</span>
                            <span className="ml-1">
                                {new Date(comment.createdAt).toLocaleString(i18n.language === "vi" ? "vi-VN" : "en-US")}
                            </span>
                        </div>
                    </div>

                    {comment.parentId && (
                        <div className="bg-muted/60 p-3 rounded-md text-sm border-l-4 border-blue-400">
                            <div className="font-semibold text-muted-foreground text-xs mb-1 uppercase">
                                {t("comments.detail.replyingTo")}
                            </div>
                            <div className="italic text-muted-foreground">&quot;{comment.parentContent}&quot;</div>
                        </div>
                    )}

                    <div>
                        <div className="font-semibold text-sm mb-2 text-foreground">{t("comments.detail.content")}</div>
                        <div className="bg-background border rounded-md p-3 text-sm whitespace-pre-wrap max-h-75 overflow-y-auto leading-relaxed">
                            {comment.content}
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>{t("comments.actions.cancel")}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}