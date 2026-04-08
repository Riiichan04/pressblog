"use client";

import MarkdownIt from 'markdown-it';
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
    ImagePlus,
    FolderTree, Tags, Link as AlignLeft, X
} from "lucide-react";
import Image from "next/image";
import "@/components/styles/post-editor.css"
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

const TextEditor = dynamic(() => import("@/components/editors/editor"), {
    ssr: false,
});

export default function WritePostComponent() {
    const { t } = useTranslation(["editor", "common"]);

    const titleRef = useRef<HTMLTextAreaElement>(null);
    const [coverImage, setCoverImage] = useState<string | null>(null);

    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [excerpt, setExcerpt] = useState("");
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
        linkify: true // Tự động biến URL thành link luôn cho tiện
    }), [])

    //FIXME: Merge 2 function below into 1
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
            const hasCategory = category !== "";
            const hasContent = contentLengthRef.current > 100;

            setIsPublishable(hasTitle && hasCategory && hasContent);
        }, 500),
        [category]
    );

    //Handle editor's content
    const handleEditorChange = useCallback((html: string, length: number) => {
        contentRef.current = html;
        contentLengthRef.current = length;
        uploadValidation();
    }, [uploadValidation]);

    //Save current post (currently saved into a store)
    const handleSaveCurrentPost = useCallback(() => {
        if (!user || !contentRef || !titleRef.current) return;

        try {
            const post: PostRequest = {
                name: titleRef.current.value,
                categoryName: category,
                content: contentRef.current,
                email: user?.email,
                language: "VI",
                thumbnail: coverImage,
                listTag: tags.split(",").map(tag => tag.trim())
            };
            dispatcher(savePost({ post, updatedAt: Date.now() }));
            toast.success(t("editor.save.success"));
        } catch {
            toast.error(t("editor.save.error"));
        }
    }, [user, contentRef, titleRef, category, tags, dispatcher, t, coverImage]);


    //Handle import markdown
    const handleImportMarkdown = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const markdownText = event.target?.result as string;

            try {
                const htmlContent = mdParser.render(markdownText);
                console.log(htmlContent)
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



    //For validate Publish button
    useEffect(() => {
        uploadValidation();
    }, [category, uploadValidation]);

    useEffect(() => {
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
                    categoryName: category,
                    content: contentRef.current,
                    email: user.email,
                    language: "VI",
                    listTag: tags.split(",").map(tag => tag.trim()),
                    thumbnail: coverImage
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
    }, [isPublishRequested, titleRef, contentRef, category, tags, coverImage, user, dispatcher, t]);


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
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="h-8 border-none shadow-none focus:ring-1 focus:ring-muted focus:ring-offset-0 bg-transparent hover:bg-muted/50 w-full md:max-w-md transition-colors rounded-sm px-2 data-placeholder:text-muted-foreground">
                                <SelectValue placeholder={t("layout.category_placeholder", { ns: "editor" })} />
                            </SelectTrigger>
                            <SelectContent>
                                {
                                    listCategory.length > 0 && listCategory.map(category =>
                                        <SelectItem
                                            key={category.slug}
                                            value={category.slug}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    )
                                }
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center min-h-8.5 text-sm group/prop">
                        <div className="w-32 flex items-center gap-2 text-foreground">
                            <Tags className="h-4 w-4" /> {t("layout.tags", { ns: "editor" })}
                        </div>
                        <Input
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            placeholder={t("layout.tags_placeholder", { ns: "editor" })}
                            className="h-8 border-none shadow-none focus-visible:ring-1 focus-visible:ring-muted bg-transparent hover:bg-muted/50 w-full md:max-w-md transition-colors rounded-sm px-2"
                        />
                    </div>

                    <div className="flex items-start min-h-8.5 text-sm group/prop mt-1">
                        <div className="w-32 flex items-center gap-2 text-foreground pt-1.5">
                            <AlignLeft className="h-4 w-4" /> {t("layout.excerpt", { ns: "editor" })}
                        </div>
                        <textarea
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                            placeholder={t("layout.excerpt_placeholder", { ns: "editor" })}
                            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-1 focus:ring-muted hover:bg-muted/50 transition-colors rounded-sm px-2 py-1.5 resize-none min-h-15"
                        />
                    </div>
                </div>

                <FieldSeparator />

                {/* Markdown Editor */}
                <TextEditor
                    onEditorCreate={(editor) => setEditorInstance(editor)}
                    onChange={handleEditorChange}
                    onImageUpload={onImageDroppedInEditor}
                />

                {/* For import feature */}
                <input
                    type="file"
                    id="hidden-markdown-import"
                    onChange={handleImportMarkdown}
                    className="hidden"
                    accept=".md, .markdown"
                />
            </main>
        </div>
    );
}