"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
    EditorRoot,
    EditorContent,
    EditorCommand,
    EditorCommandItem,
    EditorCommandEmpty,
    EditorBubble,
    EditorBubbleItem,
    type EditorInstance
} from "novel";

import { handleCommandNavigation } from "novel";
import { BoldIcon, ItalicIcon, UnderlineIcon, CodeIcon, LinkIcon, Strikethrough } from "lucide-react";
import { getDefaultExtensions } from "./extensions";
import { CommandProps, getSlashCommand, getSuggestionItems } from "./slash-command";
import { ClassicToolbar } from "./tool-bar";
import { EditorTool, setFullState } from "@/store/slices/editor-slice";
import { useDispatch } from "react-redux";
import type { TFunction } from "i18next";

interface BlogEditorProps {
    initialValue?: string;
    onChange: (value: string) => void;
}

const BlogEditor = ({ initialValue, onChange }: BlogEditorProps) => {
    const { t, i18n } = useTranslation(["editor"]);

    const [editorInstance, setEditorInstance] = useState<EditorInstance | null>(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (editorInstance) {
            const placeholderExtension = editorInstance.extensionManager.extensions.find(
                (e) => e.name === "placeholder"
            );
            if (placeholderExtension) {
                placeholderExtension.options.placeholder = t("extensions.placeholder");
                editorInstance.view.dispatch(editorInstance.state.tr);
            }
        }
    }, [t, editorInstance]);

    const [extensions] = useState(() => {
        const dynamicTranslate = ((key: string) => i18n.t(key, { ns: "editor" })) as unknown as TFunction;
        return [
            ...getDefaultExtensions(t),
            getSlashCommand(() => getSuggestionItems(dynamicTranslate))
        ];
    });

    const currentSuggestionItems = getSuggestionItems(t);

    const syncToolbar = (editor: EditorInstance) => {
        const tools: EditorTool[] = [
            'bold', 'italic', 'underline', 'strike',
            'bulletList', 'orderedList', 'blockquote', 'codeBlock', 'link'
        ];

        const newState: Partial<Record<EditorTool, boolean>> = {};

        tools.forEach(tool => {
            newState[tool] = editor.isActive(tool);
        });

        for (let i = 1; i <= 6; i++) {
            const key = `heading${i}` as EditorTool;
            newState[key] = editor.isActive('heading', { level: i });
        }

        dispatch(setFullState(newState));
    };

    return (
        <EditorRoot>
            <div className="w-full max-w-5xl mx-auto bg-background">
                <ClassicToolbar editor={editorInstance} />

                <EditorContent
                    initialContent={initialValue ? undefined : undefined}
                    extensions={extensions}
                    className="relative min-h-100 w-full bg-transparent p-4 pb-24"
                    onCreate={({ editor }) => {
                        setEditorInstance(editor);
                    }}
                    onUpdate={({ editor }) => {
                        setEditorInstance(editor);
                        onChange(editor.getHTML());
                        syncToolbar(editor);
                    }}
                    onSelectionUpdate={({ editor }) => {
                        syncToolbar(editor)
                    }}
                    editorProps={{
                        handleDOMEvents: {
                            keydown: (_view, event) => handleCommandNavigation(event),
                        },
                        handlePaste: (view, event) => {
                            const text = event.clipboardData?.getData("text/plain");
                            if (!text) return false;

                            const isUrl = /^https?:\/\/[^\s]+$/i.test(text.trim());
                            const isImageUrl = /^https?:\/\/.+\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(text.trim());

                            if (isImageUrl) {
                                event.preventDefault();
                                const { state, dispatch } = view;
                                const imageType = state.schema.nodes.image;

                                if (imageType) {
                                    const imageNode = imageType.create({ src: text.trim() });
                                    dispatch(state.tr.replaceSelectionWith(imageNode));
                                    return true;
                                }
                            }

                            if (isUrl && !view.state.selection.empty) {
                                event.preventDefault();
                                const { state, dispatch } = view;
                                const { from, to } = state.selection;
                                const linkType = state.schema.marks.link;

                                if (linkType) {
                                    const linkMark = linkType.create({ href: text.trim() });
                                    dispatch(state.tr.addMark(from, to, linkMark));
                                    return true;
                                }
                            }

                            return false;
                        },
                        attributes: {
                            class: "prose prose-lg dark:prose-invert focus:outline-none max-w-full",
                        },
                    }}
                >
                    {/* Bubble Menu */}
                    <EditorBubble className="flex w-fit max-w-[90vw] overflow-hidden rounded-md border border-border bg-background shadow-xl">
                        <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleBold().run()}>
                            <button type="button" className={`flex h-10 w-10 items-center justify-center transition-colors ${editorInstance?.isActive("bold") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                                <BoldIcon size={18} />
                            </button>
                        </EditorBubbleItem>

                        <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleItalic().run()}>
                            <button type="button" className={`flex h-10 w-10 items-center justify-center transition-colors ${editorInstance?.isActive("italic") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                                <ItalicIcon size={18} />
                            </button>
                        </EditorBubbleItem>

                        <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleUnderline().run()}>
                            <button type="button" className={`flex h-10 w-10 items-center justify-center transition-colors ${editorInstance?.isActive("underline") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                                <UnderlineIcon size={18} />
                            </button>
                        </EditorBubbleItem>

                        <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleStrike().run()}>
                            <button type="button" className={`flex h-10 w-10 items-center justify-center transition-colors ${editorInstance?.isActive("strike") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                                <Strikethrough size={18} />
                            </button>
                        </EditorBubbleItem>

                        <EditorBubbleItem onSelect={(editor) => editor.chain().focus().toggleCode().run()}>
                            <button type="button" className={`flex h-10 w-10 items-center justify-center transition-colors ${editorInstance?.isActive("code") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                                <CodeIcon size={18} />
                            </button>
                        </EditorBubbleItem>

                        <EditorBubbleItem onSelect={(editor) => {
                            const { from, to } = editor.state.selection;
                            const selectedText = editor.state.doc.textBetween(from, to, " ");

                            if (editor.isActive("link")) {
                                editor.chain().focus().unsetLink().run();
                            } else {
                                if (selectedText) {
                                    editor.chain().focus().setLink({ href: "https://" }).run();
                                } else {
                                    editor.chain().focus().insertContent([
                                        {
                                            type: "text",
                                            text: t("editor.link_title"),
                                            marks: [{ type: "link", attrs: { href: "https://" } }]
                                        }
                                    ]).run();
                                }
                            }
                        }}>
                            <button type="button" className={`flex h-10 w-10 items-center justify-center transition-colors ${editorInstance?.isActive("link") ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
                                <LinkIcon size={18} />
                            </button>
                        </EditorBubbleItem>
                    </EditorBubble>

                    {/* Slash command */}
                    <EditorCommand className="z-50 h-auto max-h-82.5 w-72 overflow-y-auto rounded-md border border-border bg-background px-1 py-2 shadow-md">
                        <EditorCommandEmpty className="px-2 text-muted-foreground text-sm py-2">
                            {t("editor.command_not_found")}
                        </EditorCommandEmpty>
                        {currentSuggestionItems.map((item) => (
                            <EditorCommandItem
                                value={item.title}
                                onCommand={(val) => item.command(val as unknown as CommandProps)}
                                className="flex w-full items-center space-x-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted cursor-pointer transition-colors"
                                key={item.title}
                            >
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-foreground">
                                    {item.icon}
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-medium text-foreground truncate">{item.title}</p>
                                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                                </div>
                            </EditorCommandItem>
                        ))}
                    </EditorCommand>
                </EditorContent>
            </div>
        </EditorRoot>
    );
};

export default BlogEditor;