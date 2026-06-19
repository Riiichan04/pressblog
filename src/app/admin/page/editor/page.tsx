"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Save, ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { EditorInstance } from "novel";
import { uploadImageToCloudinary } from "@/services/upload-service";
import { pageService } from "@/services/static-page-service";
import { StaticPageRequest } from "@/common/types/static-page";

const TextEditor = dynamic(() => import("@/components/editors/editor"), {
    ssr: false,
});

export default function StaticPageEditor() {
    const { t } = useTranslation(["common", "editor"]);
    const router = useRouter();
    const searchParams = useSearchParams();
    const pageId = searchParams.get("id");

    const [isLoading, setIsLoading] = useState(false);
    const [editorInstance, setEditorInstance] = useState<EditorInstance | null>(null);
    
    const titleRef = useRef<HTMLTextAreaElement>(null);
    const [slug, setSlug] = useState("");
    const [isPublished, setIsPublished] = useState(true);
    const contentRef = useRef<string>("");

    useEffect(() => {
        const fetchPageData = async () => {
            if (!pageId || !editorInstance) return;
            try {
                const data = await pageService.getPageById(Number(pageId));
                if (titleRef.current) titleRef.current.value = data.title;
                setSlug(data.slug);
                setIsPublished(data.isPublished);
                editorInstance.commands.setContent(data.content);
                contentRef.current = data.content;
            } catch (error) {
                toast.error(t("import.error", { ns: "editor" }));
            }
        };
        fetchPageData();
    }, [pageId, editorInstance, t]);

    const handleEditorChange = useCallback((html: string) => {
        contentRef.current = html;
    }, []);

    const onImageDroppedInEditor = async (file: File) => {
        try {
            const { url } = await uploadImageToCloudinary(file, "pressblog/pages");
            return url;
        } catch {
            toast.error(t("editor.upload_error", { ns: "editor" }));
            return null;
        }
    };

    const handleSave = async () => {
        const title = titleRef.current?.value.trim();
        if (!title || !contentRef.current || contentRef.current === "<p></p>") {
            toast.error(t("upload.validate_error", { ns: "editor" }));
            return;
        }

        setIsLoading(true);
        try {
            const requestData: StaticPageRequest = {
                title,
                slug: slug.trim() || undefined,
                content: contentRef.current,
                isPublished
            };

            if (pageId) {
                await pageService.updatePage(Number(pageId), requestData);
                toast.success(t("editor.save.success", { ns: "editor" }));
            } else {
                await pageService.createPage(requestData);
                toast.success(t("upload.success", { ns: "editor" }));
                router.push("/admin/pages");
            }
        } catch (error) {
            toast.error(t("editor.save.error", { ns: "editor" }));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
                    <Button variant="ghost" onClick={() => router.back()} className="gap-2">
                        <ChevronLeft className="h-4 w-4" /> {t("navbar.back_previous", { ns: "common" })}
                    </Button>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Xuất bản:</span>
                            <Switch 
                                checked={isPublished} 
                                onCheckedChange={setIsPublished} 
                            />
                        </div>
                        <Button onClick={handleSave} disabled={isLoading} className="gap-2">
                            <Save className="h-4 w-4" /> 
                            {isLoading ? t("editor.publishing", { ns: "editor" }) : t("editor.publish", { ns: "editor" })}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto max-w-4xl pt-8 px-6 md:px-12">
                <textarea
                    ref={titleRef}
                    placeholder={t("layout.title_placeholder", { ns: "editor" })}
                    className="w-full bg-transparent border-none text-4xl font-bold focus:outline-none resize-none placeholder:text-muted-foreground/40 leading-tight mb-4"
                    rows={1}
                />

                <div className="flex items-center mb-8 text-muted-foreground text-sm">
                    <span className="mr-2">pressblog.com/</span>
                    <input 
                        type="text" 
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="tuy-chinh-duong-dan"
                        className="bg-transparent border-b border-dashed border-border focus:border-primary outline-none py-1 min-w-[250px] transition-colors"
                    />
                </div>

                <div className="min-h-[500px]">
                    <TextEditor
                        onEditorCreate={setEditorInstance}
                        onChange={handleEditorChange}
                        onImageUpload={onImageDroppedInEditor}
                    />
                </div>
            </main>
        </div>
    );
}