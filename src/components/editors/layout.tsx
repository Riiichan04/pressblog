"use client";

import MarkdownIt from 'markdown-it';
import TurndownService from 'turndown';
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import 'highlight.js/styles/github-dark.css';
import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';
import "@/components/styles/post-editor.css"

import {
    ImagePlus,
    FolderTree, Tags, Link as AlignLeft, X
} from "lucide-react";
import Image from "next/image";
import { FieldSeparator } from "../ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { getCurrentCategory } from "@/services/post-metadata-service";
import { Category } from "@/common/types/post-metadata";
import { useAuth } from "@/context/auth-context";
import { useDispatch, useSelector } from "react-redux";
import { resetPublishRequest, savePost, setCanPublish } from "@/store/slices/post-slice";
import { PostRequest } from "@/common/types/post";
import { toast } from "sonner";
import { uploadImageToCloudinary } from "@/services/upload-service";
import { uploadPost } from "@/services/post-service";
import { RootState } from "@/store/store";
import { debounce } from "lodash";
import { EditorInstance } from "novel";
import { TagInput } from '../ui/tag-input';

const TextEditor = dynamic(() => import("@/components/editors/editor"), {
    ssr: false,
});

export default function WritePostComponent() {
    const { t } = useTranslation(["editor", "common"]);

    const titleRef = useRef<HTMLTextAreaElement>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);

    const categoryRef = useRef<string>("");
    const tagsRef = useRef<string[]>([]);
    const excerptRef = useRef<HTMLTextAreaElement>(null);

    const [isPublishable, setIsPublishable] = useState(false);

    const contentRef = useRef<string>("");
    const contentLengthRef = useRef<number>(0);

    const [listCategory, setListCategory] = useState<Category[]>([])

    const fileInputRef = useRef<HTMLInputElement>(null);
    const uploadedImagesRef = useRef<string[]>([]);
    const { user } = useAuth()
    const dispatcher = useDispatch()
    const isPublishRequested = useSelector((state: RootState) => state.post.isPublishRequested);

    const [editorInstance, setEditorInstance] = useState<EditorInstance | null>(null);

    const mdParser = useMemo(() => new MarkdownIt({
        html: true,
        breaks: true,
        linkify: true
    }), [])

    //Upload image in editor
    const onImageDroppedInEditor = async (file: File) => {
        const { url, publicId } = await uploadImageToCloudinary(file, "/temp");
        uploadedImagesRef.current.push(publicId);
        return url;
    };

    //Upload thumbnail
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const { url } = await uploadImageToCloudinary(file, "pressblog/thumbnails");
                setCoverImage(url);
            } catch {
                toast.error(t("editor.upload_error"));
            }
        }
    };

    //Validate for Publish button
    const uploadValidation = useMemo(
        () => debounce(() => {
            const currentTitle = titleRef.current?.value || "";

            const hasTitle = currentTitle.trim().length >= 10;
            const hasCategory = categoryRef.current !== "";
            const hasContent = contentLengthRef.current > 100;

            setIsPublishable(hasTitle && hasCategory && hasContent);
        }, 500),
        []
    );

    //Handle editor's content
    const handleEditorChange = useCallback((html: string, length: number) => {
        contentRef.current = html;
        contentLengthRef.current = length;
        uploadValidation();
    }, [uploadValidation]);

    //Save current post
    const handleSaveCurrentPost = useCallback(() => {
        if (!user || !contentRef || !titleRef.current) return;

        try {
            const post: PostRequest = {
                name: titleRef.current.value,
                categoryName: categoryRef.current,
                content: contentRef.current,
                email: user?.email,
                language: "VI",
                thumbnail: coverImage,
                excerpt: excerptRef.current?.value || "",
                listTag: tagsRef.current
            };
            dispatcher(savePost({ post, updatedAt: Date.now() }));
            toast.success(t("editor.save.success"));
        } catch {
            toast.error(t("editor.save.error"));
        }
    }, [user, dispatcher, t, coverImage]);


    //Handle import markdown
    const handleImportMarkdown = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const markdownText = event.target?.result as string;

            try {
                const htmlContent = mdParser.render(markdownText);
                if (editorInstance) {
                    editorInstance.commands.setContent(htmlContent);
                }

                const textLength = htmlContent.replace(/<[^>]*>/g, "").trim().length;
                handleEditorChange(htmlContent, textLength);

                toast.success(t("import.success"));
            } catch {
                toast.error(t("import.error"));
            }
        };
        reader.readAsText(file);

        e.target.value = "";
    }, [editorInstance, handleEditorChange, t, mdParser]);

    //Export markdown
    const handleExportMarkdown = useCallback(() => {
        const htmlContent = contentRef.current;
        if (!htmlContent) {
            toast.error(t("editor.missing_content"));
            return;
        }

        const turndownService = new TurndownService({
            headingStyle: 'atx',
            codeBlockStyle: 'fenced'
        });

        let markdown = turndownService.turndown(htmlContent);

        const currentTitle = titleRef.current?.value || 'Untitled';
        markdown = `# ${currentTitle}\n\n${markdown}`;

        const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${currentTitle}.md`;
        link.click();
        URL.revokeObjectURL(url);
        toast.success(t("export.success"));
    }, [t]);

    const handleExportPDF = useCallback(async () => {
        if (!contentRef.current) {
            toast.error(t("editor.missing_content"));
            return;
        }

        toast.info(t("export.processing"));

        const container = document.createElement('div');
        container.style.backgroundColor = '#ffffff';
        container.style.padding = '2rem';
        container.style.width = '800px';
        container.style.color = '#000000';

        const currentTitle = titleRef.current?.value || 'Untitled Document';
        const titleEl = document.createElement('h1');
        titleEl.innerText = currentTitle;
        titleEl.style.fontSize = '2.5rem';
        titleEl.style.fontWeight = 'bold';
        titleEl.style.marginBottom = '1.5rem';
        titleEl.style.borderBottom = '2px solid #e5e7eb';
        titleEl.style.paddingBottom = '1rem';
        titleEl.style.color = '#000000';
        container.appendChild(titleEl);

        const editorDOM = document.querySelector('.ProseMirror');
        if (editorDOM) {
            const contentClone = editorDOM.cloneNode(true) as HTMLElement;
            contentClone.classList.remove('dark:prose-invert');
            container.appendChild(contentClone);
        }

        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.top = '0';
        document.body.appendChild(container);

        try {
            const canvas = await html2canvas(container, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
                //Override pdf styling to light mode
                onclone: (clonedDoc) => {
                    clonedDoc.documentElement.classList.remove('dark');
                    clonedDoc.body.classList.remove('dark');
                }
            });

            const imgData = canvas.toDataURL('image/jpeg', 0.98);
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            const pageHeight = pdf.internal.pageSize.getHeight();

            let position = 0;

            if (pdfHeight <= pageHeight) {
                pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
            } else {
                while (position < pdfHeight) {
                    pdf.addImage(imgData, 'JPEG', 0, position * -1, pdfWidth, pdfHeight);
                    position += pageHeight;
                    if (position < pdfHeight) {
                        pdf.addPage();
                    }
                }
            }

            pdf.save(`${currentTitle}.pdf`);
            toast.success(t("export.success"));

        } catch (error) {
            console.error("PDF Export Error:", error);
            toast.error(t("export.error"));
        } finally {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        }
    }, [t]);


    useEffect(() => {
        uploadValidation();
        return () => {
            uploadValidation.cancel();
        };
    }, [uploadValidation]);

    //For CTRL + S
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 's') {
                event.preventDefault();
                handleSaveCurrentPost();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleSaveCurrentPost]);

    //For fetching category
    useEffect(() => {
        const fetchCategory = async () => {
            const categoryResponse = await getCurrentCategory()
            const categories = categoryResponse
            if (categories && categories.length > 0) setListCategory(categories)
        }
        fetchCategory()
    }, [])

    useEffect(() => {
        dispatcher(setCanPublish(isPublishable));
    }, [isPublishable, dispatcher]);

    //For publish
    useEffect(() => {
        const doPublish = async () => {
            if (!titleRef.current?.value.trim() || !contentRef || !user) {
                toast.error(t("upload.validate_error"));
                dispatcher(resetPublishRequest());
                return;
            }

            try {
                const postData: PostRequest = {
                    name: titleRef.current.value || "",
                    categoryName: categoryRef.current,
                    content: contentRef.current,
                    email: user.email,
                    language: "VI",
                    listTag: tagsRef.current,
                    thumbnail: coverImage,
                    excerpt: excerptRef.current?.value || ""
                };

                const res = await uploadPost(postData);
                if (res.result) {
                    toast.success(t("upload.success"));
                }
            } catch {
                toast.error(t("upload.error"));
            } finally {
                dispatcher(resetPublishRequest());
            }
        };

        if (isPublishRequested) {
            doPublish();
        }
    }, [isPublishRequested, coverImage, user, dispatcher, t]);


    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <main className="container mx-auto max-w-4xl pt-4 px-6 md:px-12">
                {/* Cover Image */}
                <div className="mb-6 group">
                    {!coverImage ? (
                        <Button
                            variant="ghost"
                            className="text-muted-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity -ml-4"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            {t("layout.add_cover", { ns: "editor" })}
                        </Button>
                    ) : (
                        <div className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden mb-8 border border-border/50">
                            <Image
                                src={coverImage}
                                alt="Cover"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute right-4 bottom-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className="bg-background/80 backdrop-blur-sm hover:bg-background"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {t("layout.change_cover", { ns: "editor" })}
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="bg-background/80 backdrop-blur-sm hover:bg-background text-destructive"
                                    onClick={() => setCoverImage(null)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        className="hidden"
                        accept="image/*"
                    />
                </div>

                {/* Title Input */}
                <textarea
                    ref={titleRef}
                    placeholder={t("layout.title_placeholder", { ns: "editor" })}
                    defaultValue=""
                    onChange={() => uploadValidation()}
                    className="w-full bg-transparent border-none text-3xl md:text-4xl font-bold focus:outline-none resize-none placeholder:text-muted-foreground/40 leading-tight mb-4"
                    rows={1}
                />

                <FieldSeparator />

                {/* Properties Section */}
                <div className="flex flex-col gap-1 border-b border-border/40 pb-2 mt-4">
                    <div className="flex items-center min-h-8.5 text-sm group/prop">
                        <div className="w-32 flex items-center gap-2 text-foreground">
                            <FolderTree className="h-4 w-4" /> {t("layout.category", { ns: "editor" })}
                        </div>
                        <Select onValueChange={(val) => { categoryRef.current = val; uploadValidation(); }}>
                            <SelectTrigger className="h-8 border-none shadow-none focus:ring-1 focus:ring-muted focus:ring-offset-0 bg-transparent hover:bg-muted/50 w-full md:max-w-md transition-colors rounded-sm px-2 data-placeholder:text-muted-foreground">
                                <SelectValue placeholder={t("layout.category_placeholder", { ns: "editor" })} />
                            </SelectTrigger>
                            <SelectContent>
                                {listCategory.length > 0 && listCategory.map(category =>
                                    <SelectItem key={category.slug} value={category.slug}>
                                        {category.name}
                                    </SelectItem>
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center min-h-8.5 text-sm group/prop">
                        <div className="w-32 flex items-center gap-2 text-foreground">
                            <Tags className="h-4 w-4" /> {t("layout.tags", { ns: "editor" })}
                        </div>
                        <TagInput
                            placeholder={t("layout.tags_placeholder", { ns: "editor" })}
                            onChange={(tags) => { tagsRef.current = tags; uploadValidation(); }}
                        />
                    </div>

                    <div className="flex items-start min-h-8.5 text-sm group/prop mt-1">
                        <div className="w-32 flex items-center gap-2 text-foreground pt-1.5">
                            <AlignLeft className="h-4 w-4" /> {t("layout.excerpt", { ns: "editor" })}
                        </div>
                        <textarea
                            ref={excerptRef}
                            onChange={() => uploadValidation()}
                            defaultValue=""
                            placeholder={t("layout.excerpt_placeholder", { ns: "editor" })}
                            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-muted hover:bg-muted/50 transition-colors rounded-sm px-2 py-1.5 resize-none min-h-15"
                        />
                    </div>
                </div>

                <FieldSeparator />

                <TextEditor
                    onEditorCreate={(editor) => setEditorInstance(editor)}
                    onChange={handleEditorChange}
                    onImageUpload={onImageDroppedInEditor}
                />

                <input
                    type="file"
                    id="hidden-markdown-import"
                    onChange={handleImportMarkdown}
                    className="hidden"
                    accept=".md, .markdown"
                />

                <button
                    id="hidden-export-md"
                    onClick={handleExportMarkdown}
                    className="hidden"
                />
                <button
                    id="hidden-export-pdf"
                    onClick={handleExportPDF}
                    className="hidden"
                />
            </main>
        </div>
    );
}