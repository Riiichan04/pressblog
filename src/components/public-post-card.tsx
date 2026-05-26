"use client"

import Image from "next/image";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { BookOpen, Eye } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PublicPostResponse } from "@/common/types/public-user";

export default function PublicPostCard({ post }: { post: PublicPostResponse }) {
    const { t } = useTranslation("common")

    return (
        <Card key={post.id} className="flex flex-col overflow-hidden h-full hover:shadow-md transition-shadow group">
            <div className="relative aspect-video w-full overflow-hidden bg-muted">
                {post.thumbnail ? (
                    <Image
                        src={post.thumbnail}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full text-muted-foreground bg-primary/5">
                        <BookOpen className="h-8 w-8 opacity-40" />
                    </div>
                )}
            </div>

            <CardHeader className="p-4 space-y-1.5 flex-1">
                <CardTitle className="text-base font-bold line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug}`}>
                        {post.title}
                    </Link>
                </CardTitle>
                <CardDescription className="text-xs line-clamp-3 leading-relaxed">
                    {post.summary || ""}
                </CardDescription>
            </CardHeader>

            <CardFooter className="p-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground bg-muted/5">
                <div className="flex items-center gap-3">
                    <span className="font-medium">
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                        <Eye className="h-3.5 w-3.5" />
                        {post.viewCount} {t("search.view_count")}
                    </span>
                </div>
                <Link href={`/blog/${post.slug}`} className="text-primary font-semibold hover:underline">
                    {t("search.read_more")} →
                </Link>

            </CardFooter>
        </Card>
    )
}