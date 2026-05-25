import { fallBackColor, getFallback } from "@/common/utils/avatar-loader";
import TableOfContents from "@/components/table-of-content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getPostBySlug } from "@/services/post-service"
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from 'next/navigation';
import { getServerTranslation } from "@/common/utils/server-translation";
import { processContentAndGetHeadings } from "@/common/utils/blog-toc";

interface Props {
    params: Promise<{ slug: string; locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;

    const post = await getPostBySlug(slug);

    if (!post) {
        return {
            title: 'Post Not Found | PressBlog',
        };
    }

    return {
        title: `${post.name} | PressBlog`,
        description: `Đọc bài viết ${post.name} trên PressBlog`,
        openGraph: {
            title: post.name,
            description: `Đọc bài viết ${post.name} trên PressBlog`,
            images: [post.thumbnail || '/default-banner.jpg'],
        },
    };
}

export default async function BlogDetail({ params }: Props) {
    const { slug } = await params


    const post = await getPostBySlug(slug)
    if (!post) return notFound()

    const { t } = await getServerTranslation('blog');
    const { processedHtml, headings } = processContentAndGetHeadings(post.content);

    return (
        <main className="container flex justify-center mx-auto py-10 px-4 mt-10">
            <div className="flex flex-col lg:flex-row gap-12 max-w-6xl">
                <article className="flex-1 min-w-0">
                    <div className="w-full">
                        {post.thumbnail &&
                            <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-8 border border-border/50">
                                <Image
                                    src={post.thumbnail}
                                    alt="Cover"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        }
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4">{post.name}</h1>
                    <div className="text-end text-gray-500 gap-2">
                        <p className="text-sm">{t("layout.upload_date")}: {new Date(post.updatedAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                    <div className="mt-4 flex items-center gap-2">
                        <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={post.author.avatar || ""} alt={post.author.username} />
                            <AvatarFallback className={`${fallBackColor(post.author.username)} text-white`}>
                                {getFallback(post.author.username)}
                            </AvatarFallback>
                        </Avatar>
                        <a href={`/author/${post.author.username}`}>
                            <div className="flex flex-col space-y-1 min-w-0">
                                <p className="text-sm font-medium leading-tight truncate">
                                    {post.author.displayName || post.author.username}
                                </p>
                                <p className="text-xs leading-tight text-muted-foreground truncate">
                                    {post.author.email}
                                </p>
                            </div>
                        </a>
                    </div>
                    <div
                        className="prose dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: processedHtml }}
                    />
                </article>

                <aside className="hidden lg:block w-72 shrink-0">
                    <TableOfContents headings={headings} />
                </aside>
            </div>
        </main>
    )
}