"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PostStatus } from "@/common/types/post"

export type PostTableItem = {
    id: number
    title: string
    status: PostStatus
    views: number
    updatedAt: string
}

export const columns: ColumnDef<PostTableItem>[] = [
    {
        accessorKey: "title",
        header: "Tiêu đề",
        cell: ({ row }) => <div className="font-medium max-w-75 truncate">{row.getValue("title")}</div>,
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge variant={status === "published" ? "default" : "secondary"}>
                    {status === "published" ? "Đã xuất bản" : "Bản nháp"}
                </Badge>
            )
        },
    },
    {
        accessorKey: "views",
        header: "Lượt xem",
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue("views"))
            return <div className="font-medium">{amount.toLocaleString()}</div>
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Ngày tạo",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const post = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(post.id + "")}>
                            <Eye className="mr-2 h-4 w-4" /> Xem bài viết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" /> Xóa bài
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]