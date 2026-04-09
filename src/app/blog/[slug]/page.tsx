import { cn } from "@/lib/utils";
import { getPostBySlug } from "@/services/post-service"
import MarkdownIt from "markdown-it";
import Image from "next/image";
import { notFound } from 'next/navigation';

export default async function BlogDetail({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const post = await getPostBySlug(slug)

    const mdParser = new MarkdownIt({
        html: true,
        breaks: true,
        linkify: true
    })

    if (post === null) return notFound()
    const htmlContent = mdParser.render(post.content);
    return (
        <div className="mt-20 w-full flex justify-center">
            <article className="max-w-4xl mx-x-auto py-10">
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
                <h1 className="text-4xl font-bold">{post.name}</h1>
                <div className="mt-4 text-gray-500">
                    Ngày đăng/chỉnh sửa: {new Date(post.updatedAt).toLocaleDateString('vi-VN')}
                </div>

                <div
                    className={cn(
                        "prose prose-lg max-w-none",
                        "dark:prose-invert",

                        // Headings (H1 -> H6)
                        "prose-headings:scroll-mt-20 prose-headings:font-bold prose-headings:tracking-tight",
                        "prose-h1:text-4xl prose-h1:mb-8",
                        "prose-h2:text-3xl prose-h2:border-b dark:prose-h2:border-border pb-2 mt-10",
                        "prose-h3:text-2xl",
                        "prose-h4:text-xl",

                        // Link & Bold
                        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-a:font-medium",
                        "prose-strong:text-foreground prose-strong:font-bold",

                        // Code & Code Blocks 
                        "prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium",
                        "prose-code:before:content-[''] prose-code:after:content-['']",
                        "prose-pre:bg-[#0d1117] prose-pre:border prose-pre:border-border prose-pre:shadow-sm",

                        // Blockquotes
                        "prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:italic prose-blockquote:bg-muted/30 prose-blockquote:py-1 prose-blockquote:px-6",

                        // Lists & Tasklists
                        "prose-li:marker:text-primary",
                        "prose-ul:list-disc prose-ol:list-decimal",

                        // Tables 
                        "prose-th:text-foreground prose-th:bg-muted/50 prose-th:p-3 prose-th:border prose-th:border-border",
                        "prose-td:p-3 prose-td:border prose-td:border-border",

                        // Images & Figures
                        "prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto",

                        // Horizontal Rules
                        "prose-hr:border-border"
                    )}
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </article>
        </div>
    )
}