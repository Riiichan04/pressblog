import { Command, renderItems } from "novel";
import {
    Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
    List, ListOrdered, TextQuote, CheckSquare, CodeIcon,
    BoldIcon, ItalicIcon, UnderlineIcon, Strikethrough,
    Image as ImageIcon, LinkIcon,
    Spline
} from "lucide-react";
import { Range, Editor, type JSONContent } from "@tiptap/core";
import type { TFunction } from "i18next";
import type { ReactNode } from "react";

interface SafeChainedCommands {
    deleteRange: (range: Range) => SafeChainedCommands;
    focus: () => SafeChainedCommands;
    run: () => boolean;
    toggleHeading: (options: { level: 1 | 2 | 3 | 4 | 5 | 6 }) => SafeChainedCommands;
    toggleBulletList: () => SafeChainedCommands;
    toggleOrderedList: () => SafeChainedCommands;
    toggleTaskList: () => SafeChainedCommands;
    toggleBlockquote: () => SafeChainedCommands;
    toggleCodeBlock: () => SafeChainedCommands;
    toggleBold: () => SafeChainedCommands;
    toggleItalic: () => SafeChainedCommands;
    toggleUnderline: () => SafeChainedCommands;
    toggleStrike: () => SafeChainedCommands;
    insertContent: (content: string | JSONContent | JSONContent[]) => SafeChainedCommands;
}

export interface CommandProps {
    editor: Omit<Editor, "chain"> & {
        chain: () => SafeChainedCommands;
    };
    range: Range;
}

export interface SuggestionItem {
    title: string;
    description: string;
    searchTerms: string[];
    icon: ReactNode;
    command: (props: CommandProps) => void;
}

export const getSuggestionItems = (t: TFunction): SuggestionItem[] => [
    {
        title: t("slash_command.h1.title"),
        description: t("slash_command.h1.desc"),
        searchTerms: ["h1", "heading", "tieude"],
        icon: <Heading1 size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run();
        },
    },
    {
        title: t("slash_command.h2.title"),
        description: t("slash_command.h2.desc"),
        searchTerms: ["h2", "heading", "tieude"],
        icon: <Heading2 size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run();
        },
    },
    {
        title: t("slash_command.h3.title"),
        description: t("slash_command.h3.desc"),
        searchTerms: ["h3", "heading", "tieude"],
        icon: <Heading3 size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run();
        },
    },
    {
        title: t("slash_command.h4.title"),
        description: t("slash_command.h4.desc"),
        searchTerms: ["h4", "heading", "tieude"],
        icon: <Heading4 size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleHeading({ level: 4 }).run();
        },
    },
    {
        title: t("slash_command.h5.title"),
        description: t("slash_command.h5.desc"),
        searchTerms: ["h5", "heading", "tieude"],
        icon: <Heading5 size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleHeading({ level: 5 }).run();
        },
    },
    {
        title: t("slash_command.h6.title"),
        description: t("slash_command.h6.desc"),
        searchTerms: ["h6", "heading", "tieude"],
        icon: <Heading6 size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleHeading({ level: 6 }).run();
        },
    },
    {
        title: t("slash_command.bullet_list.title"),
        description: t("slash_command.bullet_list.desc"),
        searchTerms: ["list", "bullet", "danhsach"],
        icon: <List size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
    },
    {
        title: t("slash_command.ordered_list.title"),
        description: t("slash_command.ordered_list.desc"),
        searchTerms: ["list", "ordered", "danhsach"],
        icon: <ListOrdered size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
    },
    {
        title: t("slash_command.task_list.title"),
        description: t("slash_command.task_list.desc"),
        searchTerms: ["todo", "task", "congviec"],
        icon: <CheckSquare size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
    },
    {
        title: t("slash_command.quote.title"),
        description: t("slash_command.quote.desc"),
        searchTerms: ["quote", "trichdan"],
        icon: <TextQuote size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        },
    },
    {
        title: t("slash_command.code_block.title"),
        description: t("slash_command.code_block.desc"),
        searchTerms: ["code", "block", "ma"],
        icon: <CodeIcon size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
        },
    },
    {
        title: t("slash_command.image.title"),
        description: t("slash_command.image.desc"),
        searchTerms: ["image", "anh", "hinh"],
        icon: <ImageIcon size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).insertContent("![Mô tả ảnh](https://)").run();
        },
    },
    {
        title: t("slash_command.link.title"),
        description: t("slash_command.link.desc"),
        searchTerms: ["link", "lienket"],
        icon: <LinkIcon size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).insertContent("[Tiêu đề link](https://)").run();
        },
    },
    {
        title: t("slash_command.bold.title"),
        description: t("slash_command.bold.desc"),
        searchTerms: ["bold", "dam"],
        icon: <BoldIcon size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleBold().run();
        },
    },
    {
        title: t("slash_command.italic.title"),
        description: t("slash_command.italic.desc"),
        searchTerms: ["italic", "nghieng"],
        icon: <ItalicIcon size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleItalic().run();
        },
    },
    {
        title: t("slash_command.underline.title"),
        description: t("slash_command.underline.desc"),
        searchTerms: ["underline", "gachchan"],
        icon: <UnderlineIcon size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleUnderline().run();
        },
    },
    {
        title: t("slash_command.strike.title"),
        description: t("slash_command.strike.desc"),
        searchTerms: ["strike", "gach"],
        icon: <Strikethrough size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleStrike().run();
        },
    },
    {
        title: t("slash_command.mermaid.title"),
        description: t("slash_command.mermaid.desc"),
        searchTerms: ["mermaid", "sodo", "diagram", "chart"],
        icon: <Spline size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).insertContent({ type: 'mermaid' }).run();
        },
    },
];

export const getSlashCommand = (getItems: () => SuggestionItem[]) => Command.configure({
    suggestion: {
        items: getItems,
        render: renderItems,
    },
});