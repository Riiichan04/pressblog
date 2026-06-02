"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { Check, X, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import TableOfContents from "@/components/table-of-content";

import { getAdminPostBySlug, updatePostStatus } from "@/services/admin-service";
import { fallBackColor, getFallback } from "@/common/utils/avatar-loader";
import { processContentAndGetHeadings } from "@/common/utils/blog-toc";
import { PostStatus, PostDetail } from "@/common/types/post";

export default function AdminPreviewPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const { t } = useTranslation("admin");

    const [post, setPost] = useState<PostDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [processing, setProcessing] = useState<boolean>(false);

    useEffect(() => {
        const fetchPreview = async () => {
            try {
                const data = await getAdminPostBySlug(slug);
                setPost(data);
                console.log(data)
            } catch {
                toast.error(t("approvals.preview.notFound"));
                notFound();
            } finally {
                setIsLoading(false);
            }
        };
        fetchPreview();
    }, [slug, t]);

    const handleAction = async (action: PostStatus.PUBLISHED | PostStatus.REJECTED) => {
        if (!post) return;
        setProcessing(true);
        try {
            await updatePostStatus(post.id, action);
            if (action === PostStatus.PUBLISHED) {
                toast.success(t("approvals.messages.approveSuccess"));
            } else {
                toast.success(t("approvals.messages.rejectSuccess"));
            }
            router.push("/admin/approvals");
        } catch {
            toast.error(t("approvals.messages.error"));
        } finally {
            setProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
            </div>
        );
    }

    if (!post) return null;

    const { processedHtml, headings } = processContentAndGetHeadings(post.content);

    return (
        <div className="relative min-h-screen bg-background pb-20">
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b shadow-sm py-3 px-6 flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Button className="cursor-pointer" variant="ghost" size="icon" onClick={() => router.back()}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <p className="text-sm font-semibold tracking-wide text-muted-foreground">
                            {t("approvals.preview.mode")}
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="destructive"
                        onClick={() => handleAction(PostStatus.REJECTED)}
                        disabled={processing}
                        className="cursor-pointer"
                    >
                        <X className="h-4 w-4 mr-2" /> {t("approvals.actions.reject")}
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => handleAction(PostStatus.PUBLISHED)}
                        disabled={processing}
                        className="cursor-pointer"
                    >
                        {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Check className="h-4 w-4 mr-2" />}
                        {t("approvals.actions.approve")}
                    </Button>
                </div>
            </div>

            <main className="container flex justify-center mx-auto py-10 px-4 shadow-lg">
                <div className="flex flex-col lg:flex-row gap-12 max-w-6xl w-full">
                    <article className="flex-1 min-w-0">
                        <div className="w-full">
                            {post.thumbnail && (
                                <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-8 border border-border/50">
                                    <Image
                                        src={post.thumbnail}
                                        alt="Cover"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        <h1 className="text-4xl font-extrabold mb-4">{post.name}</h1>
                        <div className="text-end text-gray-500 gap-2">
                            <p className="text-sm">
                                {t("approvals.preview.updatedAt")}: {new Date(post.updatedAt).toLocaleDateString(t("approvals.preview.mode") === "Preview Mode" ? "en-US" : "vi-VN")}
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-2 border-b pb-6">
                            <Avatar className="h-8 w-8 shrink-0">
                                <AvatarImage src={post.author.avatar || ""} alt={post.author.username} />
                                <AvatarFallback className={`${fallBackColor(post.author.username)} text-white`}>
                                    {getFallback(post.author.username)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col space-y-1 min-w-0">
                                <p className="text-sm font-medium leading-tight truncate">
                                    {post.author.displayName || post.author.username || t("approvals.preview.unknownAuthor")}
                                </p>
                                <p className="text-xs leading-tight text-muted-foreground truncate">
                                    {post.author.email || t("approvals.preview.noEmail")}
                                </p>
                            </div>
                        </div>
                        <div
                            className="prose dark:prose-invert max-w-none mt-8"
                            dangerouslySetInnerHTML={{ __html: processedHtml }}
                        />

                        <div className="mt-12 p-4 bg-muted/50 rounded-lg text-center text-sm text-muted-foreground">
                            {t("approvals.preview.commentsDisabled")}
                        </div>
                    </article>

                    <aside className="hidden lg:block w-72 shrink-0">
                        <TableOfContents headings={headings} />
                    </aside>
                </div>
            </main>
        </div>
    );
}