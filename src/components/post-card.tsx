import { Eye, Clock, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PostDetail } from "@/common/types/post";
import { getFallback } from "@/common/utils/avatar-loader";

export function PostCard({ post }: { post: PostDetail }) {
    return (
        <div className="group flex flex-col space-y-4 rounded-2xl border bg-card p-3 transition-all hover:shadow-xl hover:-translate-y-1">
            {/* Thumbnail */}
            <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                    src={post.thumbnail}
                    alt={post.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                    <Badge className="bg-white/90 text-black backdrop-blur-md hover:bg-white border-none">
                        {post.categoryName}
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col px-1">
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{post.viewCount.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>4 ngày trước</span>
                    </div>
                </div>

                <Link href={`/post/${post.slug}`} className="group/title">
                    <h3 className="line-clamp-2 text-lg font-bold leading-tight tracking-tight group-hover/title:text-primary transition-colors">
                        {post.name}
                    </h3>
                </Link>

                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                    {post.content}
                </p>

                {/* Tags */}
                <div className="mt-3 flex flex-wrap gap-1">
                    {post.tagNames.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded bg-secondary/50 text-secondary-foreground">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Author Footer */}
                <div className="mt-auto pt-5 flex items-center justify-between border-t border-border/50">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 ring-2 ring-background">
                            <AvatarImage src={post.author.avatar || ""} />
                            <AvatarFallback className={`${getFallback(post.author.username)} text-[10px] text-white`}>
                                {getFallback(post.author.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-semibold">{post.author.name}</span>
                    </div>

                    <Link
                        href={`/post/${post.slug}`}
                        className="rounded-full p-1.5 bg-secondary hover:bg-primary hover:text-primary-foreground transition-all"
                    >
                        <ArrowUpRight size={16} />
                    </Link>
                </div>
            </div>
        </div>
    );
}