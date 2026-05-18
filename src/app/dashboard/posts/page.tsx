// src/app/dashboard/posts/page.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { getMyPosts } from "@/services/post-service"
import { toast } from "sonner"
import { columns, PostTableItem } from "@/components/dashboard/post-columns"
import { DataTable } from "@/components/dashboard/data-table"

export default function PostsPage() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<PostTableItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            // Đảm bảo user đã load xong và có id
            if (!user?.id) return; 

            try {
                setLoading(true);
                // Truyền user.id vào để gọi API
                const data = await getMyPosts(user.id.toString());
                console.log(data)
                setPosts(data);
            } catch (error: unknown) {
                toast.error((error as Error).message || "Không thể tải danh sách bài viết");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user?.id]); // Chạy lại nếu user.id thay đổi

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Bài viết của tôi</h1>
                    <p className="text-muted-foreground mt-1">Quản lý các bài viết trên blog của bạn.</p>
                </div>
                <Link href="/dashboard/posts/create">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        Viết bài mới
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-card text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mb-4 text-primary" />
                    <p>Đang tải danh sách bài viết...</p>
                </div>
            ) : (
                <DataTable columns={columns} data={posts} />
            )}
        </div>
    )
}