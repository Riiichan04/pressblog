export interface StaticPage {
    id: number;
    title: string;
    slug: string;
    content: string;
    isPublished: boolean;
    updatedAt: string;
}

export interface StaticPageRequest {
    title: string;
    slug?: string;
    content: string;
    isPublished: boolean;
}