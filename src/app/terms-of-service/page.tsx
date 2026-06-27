"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getPublicPage } from "@/services/static-page-service";
import { StaticPage } from "@/common/types/static-page";
import { notFound } from "next/navigation";
import { STATIC_PAGES } from "@/common/constants/static-page-url";
import { Skeleton } from "@/components/ui/skeleton";

export default function TermsOfServicePage() {
    const { i18n } = useTranslation(["common"]);
    const [pageData, setPageData] = useState<StaticPage | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPage = async () => {
            setIsLoading(true);
            try {
                const currentLang = (i18n.language || "vi") as "vi" | "en";
                const slug = STATIC_PAGES.termsOfService[currentLang];
                const data = await getPublicPage(slug);
                setPageData(data);
            } catch {
                console.error("Failed to load static page");
                setPageData(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPage();
    }, [i18n.language]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-background pt-32 pb-24 px-4">
                <div className="container mx-auto max-w-3xl space-y-10">
                    <div className="space-y-5 border-b border-border/60 pb-8">
                        <Skeleton className="h-12 w-3/4 md:w-2/3" />
                        <Skeleton className="h-4 w-40" />
                    </div>

                    <div className="space-y-8">
                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>

                        <div className="space-y-3">
                            <Skeleton className="h-8 w-1/3 mb-4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-11/12" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>

                        <div className="space-y-3">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!pageData) {
        return notFound()
    }

    return (
        <main className="min-h-screen bg-background pt-32 pb-24 px-4">
            <div className="container mx-auto max-w-3xl space-y-10">
                <div
                    className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-primary hover:prose-a:text-primary/80 prose-img:rounded-xl prose-img:border prose-img:border-border/50 text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: pageData.content }}
                />
            </div>
        </main >
    );
}