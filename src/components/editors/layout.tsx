"use client";

import { useState, useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    ImagePlus,
    FolderTree, Tags, Link as LinkIcon, AlignLeft, X
} from "lucide-react";
import Image from "next/image";
import "@/components/styles/post-editor.css"
import { FieldSeparator } from "../ui/field";

const TextEditor = dynamic(() => import("@/components/editors/editor"), {
    ssr: false,
});

export default function WritePostComponent() {
    const { t } = useTranslation(["editor", "common"]);

    const [title, setTitle] = useState("");
    const [coverImage, setCoverImage] = useState<string | null>(null);

    const [category, setCategory] = useState("");
    const [tags, setTags] = useState("");
    const [slug, setSlug] = useState("");
    const [excerpt, setExcerpt] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setCoverImage(imageUrl);
        }
    };

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
                    placeholder={t("layout.title_placeholder", { ns: "editor" })}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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
                        <Input
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder={t("layout.category_placeholder", { ns: "editor" })}
                            className="h-8 border-none shadow-none focus-visible:ring-1 focus-visible:ring-muted bg-transparent hover:bg-muted/50 w-full md:max-w-md transition-colors rounded-sm px-2"
                        />
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

                    <div className="flex items-center min-h-8.5 text-sm group/prop">
                        <div className="w-32 flex items-center gap-2 text-foreground">
                            <LinkIcon className="h-4 w-4" /> {t("layout.slug", { ns: "editor" })}
                        </div>
                        <Input
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder={t("layout.slug_placeholder", { ns: "editor" })}
                            className="h-8 border-none shadow-none focus-visible:ring-1 focus-visible:ring-muted bg-transparent hover:bg-muted/50 w-full md:max-w-md transition-colors rounded-sm px-2 text-muted-foreground"
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
                    onChange={(data) => console.log(data)}
                />
            </main>
        </div>
    );
}