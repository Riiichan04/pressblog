import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingPostDto } from "@/common/types/dashboard";
import { PostStatus } from "@/common/types/post";

export function RecentPostsTable(props: {data: TrendingPostDto[]}) {
    return (
        <div className="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Bài viết</TableHead>
                        <TableHead className="text-center">Trạng thái</TableHead>
                        <TableHead className="text-right">Lượt xem</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {props.data.map((post) => (
                        <TableRow key={post.id}>
                            <TableCell className="font-medium">
                                <div className="flex flex-col">
                                    <span className="truncate max-w-50 sm:max-w-75">{post.name}</span>
                                    <span className="text-xs text-muted-foreground">{post.createdAt}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center">
                                <Badge variant={post.status === PostStatus.PUBLISHED ? "default" : "secondary"}>
                                    {post.status === PostStatus.PUBLISHED ? "Đã đăng" : "Bản nháp"}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {post.views.toLocaleString()}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}