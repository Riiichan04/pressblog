"use client";

import { useState, Suspense } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/auth-context";
import { PERMISSIONS } from "@/common/constants/permissions";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, CheckCircle, Loader2 } from "lucide-react";

import ApprovalsTab from "@/app/admin/approvals/page";
import AllPostsTab from "./all-post";
import { useRouter, useSearchParams } from "next/navigation";

function AdminPostsContent() {
    const { t } = useTranslation("admin");
    const { hasPermission } = useAuth();

    const router = useRouter();
    const searchParams = useSearchParams();
    const categorySlug = searchParams.get("category");

    const canApprovePost = hasPermission(PERMISSIONS.APPROVE_POST);

    const [activeTab, setActiveTab] = useState(
        categorySlug ? "all" : (canApprovePost ? "pending" : "all")
    );

    const [prevSlug, setPrevSlug] = useState(categorySlug);
    
    if (categorySlug !== prevSlug) {
        setPrevSlug(categorySlug);
        setActiveTab("all");
    }

    const handleClearCategory = () => {
        router.push("/admin/posts");
    };

    return (
        <div className="space-y-6 p-6 lg:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t("posts.title")}</h2>
                    <p className="text-muted-foreground mt-2">{t("posts.description")}</p>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-4">
                    <TabsTrigger value="all" className="flex items-center gap-2 cursor-pointer">
                        <FileText className="h-4 w-4" />
                        {t("posts.tabs.all")}
                    </TabsTrigger>

                    {canApprovePost && (
                        <TabsTrigger value="pending" className="flex items-center gap-2 relative cursor-pointer">
                            <CheckCircle className="h-4 w-4" />
                            {t("posts.tabs.pending")}
                            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
                        </TabsTrigger>
                    )}
                </TabsList>

                <TabsContent value="all" className="mt-0">
                    <AllPostsTab
                        categorySlug={categorySlug}
                        onClearCategory={handleClearCategory}
                    />
                </TabsContent>

                {canApprovePost && (
                    <TabsContent value="pending" className="mt-0">
                        <div className="[&>.space-y-6>div:first-child]:hidden">
                            <ApprovalsTab />
                        </div>
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}

//Use Suspense to handle useSearchParam error in SSR
export default function AdminPostsPage() {
    return (
        <Suspense fallback={<div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>}>
            <AdminPostsContent />
        </Suspense>
    );
}