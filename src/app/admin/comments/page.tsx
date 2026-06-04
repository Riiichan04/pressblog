"use client";

import { useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageSquare, CheckCircle, Loader2 } from "lucide-react";

import { useAuth } from "@/context/auth-context";
import { PERMISSIONS } from "@/common/constants/permissions";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommentList from "./comment-list";

function AdminCommentsContent() {
    const { t } = useTranslation("admin");
    const { hasPermission } = useAuth();

    const router = useRouter();
    const searchParams = useSearchParams();
    const postSlug = searchParams.get("post"); 

    const canApprove = hasPermission(PERMISSIONS.APPROVE_COMMENT);

    const [activeTab, setActiveTab] = useState(
        postSlug ? "all" : (canApprove ? "pending" : "all")
    );

    const [prevSlug, setPrevSlug] = useState(postSlug);
    if (postSlug !== prevSlug) {
        setPrevSlug(postSlug);
        setActiveTab("all");
    }

    const handleClearPostFilter = () => {
        router.push("/admin/comments");
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t("comments.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("comments.description")}</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="all" className="flex items-center gap-2 cursor-pointer">
                        <MessageSquare className="h-4 w-4" />
                        Tất cả bình luận
                    </TabsTrigger>

                    {canApprove && (
                        <TabsTrigger value="pending" className="flex items-center gap-2 relative cursor-pointer">
                            <CheckCircle className="h-4 w-4" />
                            Chờ duyệt
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                        </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="all" className="mt-0">
                    <CommentList filterStatus={null} postSlug={postSlug} onClearPostFilter={handleClearPostFilter} />
                </TabsContent>

                {canApprove && (
                    <TabsContent value="pending" className="mt-0">
                        <CommentList filterStatus="PENDING" postSlug={postSlug} onClearPostFilter={handleClearPostFilter} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}

export default function AdminCommentsPage() {
    return (
        <Suspense fallback={<div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
            <AdminCommentsContent />
        </Suspense>
    );
}