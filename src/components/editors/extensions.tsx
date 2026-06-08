import {
    TiptapImage,
    TaskList,
    TaskItem,
    HorizontalRule,
    StarterKit,
    Placeholder,
} from "novel";

import { Extension, InputRule, nodeInputRule } from "@tiptap/core";
import Code from '@tiptap/extension-code';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import { cx } from "class-variance-authority";
import { TFunction } from "i18next";

import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import { MermaidExtension } from "./mermaid-extension";
import { TrailingNode } from "./trailing-note";

const lowlight = createLowlight(all);

const horizontalRule = HorizontalRule.configure({
    HTMLAttributes: {
        class: cx("mt-4 mb-6 border-t border-stone-300"),
    },
});

const tiptapLink = Link
    .extend({
        addInputRules() {
            return [
                new InputRule({
                    find: /(?:^|[^!])\[([^\]]+)\]\(([^)]+)\)\s$/,
                    handler: ({ range, match, chain }) => {
                        const { from, to } = range;
                        const title = match[1];
                        const url = match[2].trim();
                        chain()
                            .deleteRange({ from, to })
                            .insertContentAt(from, [
                                {
                                    type: "text",
                                    text: title,
                                    marks: [{ type: "link", attrs: { href: url } }]
                                },
                                {
                                    type: "text",
                                    text: " "
                                }
                            ])
                            .setTextSelection(from + title.length + 1)
                            .run();
                    },
                }),
            ];
        }
    })
    .configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
            class: cx(
                "text-stone-400 underline underline-offset-[3px] hover:text-stone-600 transition-colors cursor-pointer",
            ),
        },
    });

const tiptapImage = TiptapImage.configure({
    allowBase64: true,
    HTMLAttributes: {
        class: cx("rounded-lg border border-stone-200"),
    },
});

const taskList = TaskList.configure({
    HTMLAttributes: {
        class: cx("not-prose pl-2"),
    },
});

const taskItem = TaskItem.configure({
    HTMLAttributes: {
        class: cx("flex items-start my-4"),
    },
    nested: true,
});

const codeExtension = Code.extend({
    addInputRules() {
        return [];
    },
}).configure({
    HTMLAttributes: {
        class: cx("rounded-md bg-stone-200 px-1.5 py-1 font-mono font-medium text-stone-900"),
        spellcheck: "false",
    },
});

export const imageExtension = Image.extend({
    priority: 1000,

    addInputRules() {
        return [
            nodeInputRule({
                find: /^!\[([^\]]*)\]\(([^)]+)\)\s$/,
                type: this.type,
                getAttributes: (match) => {
                    const [, alt, src] = match;
                    return { src, alt };
                },
            }),
        ];
    },
}).configure({
    allowBase64: true,
    HTMLAttributes: {
        class: "rounded-lg border border-border shadow-sm max-w-full h-auto my-4",
    },
});

const resetFormatOnEnter = Extension.create({
    name: "resetFormatOnEnter",

    addKeyboardShortcuts() {
        return {
            Enter: ({ editor }) => {
                setTimeout(() => {
                    const { selection } = editor.state;
                    const { $from, empty } = selection;

                    if (empty && $from.parent.textContent.length === 0) {
                        editor.commands.unsetAllMarks();
                        editor.commands.clearNodes();
                    }
                });

                return false;
            },
        };
    },
});

const codeBlockExtension = CodeBlockLowlight.configure({
    lowlight,
    HTMLAttributes: {
        class: cx("rounded-md bg-stone-900 text-stone-100 p-5 font-mono text-sm"), 
    },
});

const starterKit = StarterKit.configure({
    bulletList: {},
    orderedList: {},
    listItem: {},
    blockquote: {},
    codeBlock: false, 
    code: false,
    horizontalRule: false,
    dropcursor: {
        color: "#DBEAFE",
        width: 4,
    },
    gapcursor: false,
});

export const getDefaultExtensions = (t: TFunction) => [
    starterKit,
    Placeholder.configure({
        placeholder: t("extensions.placeholder"),
    }),
    codeExtension as never,
    codeBlockExtension as never,
    tiptapLink as never,
    tiptapImage,
    taskList,
    taskItem,
    resetFormatOnEnter as never,
    horizontalRule,
    Underline as never,
    MermaidExtension as never,
    TrailingNode
];