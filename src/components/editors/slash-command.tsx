import { Command, renderItems } from "novel";
import {
    Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
    List, ListOrdered, TextQuote, CheckSquare, CodeIcon,
    BoldIcon, ItalicIcon, UnderlineIcon, Strikethrough,
    Image as ImageIcon, LinkIcon
} from "lucide-react";
import { Range, Editor } from "@tiptap/core";

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
    insertContent: (content: string) => SafeChainedCommands; // Hàm chèn text/markdown
}

export interface CommandProps {
    editor: Omit<Editor, "chain"> & {
        chain: () => SafeChainedCommands;
    };
    range: Range;
}

export const suggestionItems = [
    {
        title: "Tiêu đề 1",
        description: "Tiêu đề lớn nhất",
        searchTerms: ["h1", "heading", "tieude"],
        icon: <Heading1 size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleHeading({ level: 1 }).run();
        },
    },
    {
        title: "Tiêu đề 2",
        description: "Tiêu đề lớn vừa",
        searchTerms: ["h2", "heading", "tieude"],
        icon: <Heading2 size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleHeading({ level: 2 }).run();
        },
    },
    {
        title: "Tiêu đề 3",
        description: "Tiêu đề trung bình",
        searchTerms: ["h3", "heading", "tieude"],
        icon: <Heading3 size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleHeading({ level: 3 }).run();
        },
    },
    {
        title: "Tiêu đề 4",
        description: "Tiêu đề nhỏ",
        searchTerms: ["h4", "heading", "tieude"],
        icon: <Heading4 size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleHeading({ level: 4 }).run();
        },
    },
    {
        title: "Tiêu đề 5",
        description: "Tiêu đề rất nhỏ",
        searchTerms: ["h5", "heading", "tieude"],
        icon: <Heading5 size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleHeading({ level: 5 }).run();
        },
    },
    {
        title: "Tiêu đề 6",
        description: "Tiêu đề nhỏ nhất",
        searchTerms: ["h6", "heading", "tieude"],
        icon: <Heading6 size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleHeading({ level: 6 }).run();
        },
    },
    {
        title: "Danh sách dấu chấm",
        description: "Tạo danh sách dấu chấm",
        searchTerms: ["list", "bullet", "danhsach"],
        icon: <List size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleBulletList().run();
        },
    },
    {
        title: "Danh sách đánh số",
        description: "Tạo danh sách có thứ tự",
        searchTerms: ["list", "ordered", "danhsach"],
        icon: <ListOrdered size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleOrderedList().run();
        },
    },
    {
        title: "Việc cần làm",
        description: "Tạo danh sách công việc",
        searchTerms: ["todo", "task", "congviec"],
        icon: <CheckSquare size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleTaskList().run();
        },
    },
    {
        title: "Trích dẫn",
        description: "Tạo đoạn trích dẫn",
        searchTerms: ["quote", "trichdan"],
        icon: <TextQuote size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleBlockquote().run();
        },
    },
    {
        title: "Khối mã (Code Block)",
        description: "Chèn khối mã lập trình",
        searchTerms: ["code", "block", "ma"],
        icon: <CodeIcon size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
        },
    },
    {
        title: "Thêm Hình Ảnh",
        description: "Chèn cú pháp ảnh Markdown",
        searchTerms: ["image", "anh", "hinh"],
        icon: <ImageIcon size={18} />,
        command: ({ editor, range }: CommandProps) => {
            // Thay vì dùng prompt, chèn thẳng Markdown snippet
            editor.chain().focus().deleteRange(range).insertContent("![Mô tả ảnh](https://)").run();
        },
    },
    {
        title: "Thêm Link",
        description: "Chèn cú pháp link Markdown",
        searchTerms: ["link", "lienket"],
        icon: <LinkIcon size={18} />,
        command: ({ editor, range }: CommandProps) => {
            // Thay vì dùng prompt, chèn thẳng Markdown snippet
            editor.chain().focus().deleteRange(range).insertContent("[Tiêu đề link](https://)").run();
        },
    },
    {
        title: "In đậm",
        description: "Làm đậm văn bản",
        searchTerms: ["bold", "dam"],
        icon: <BoldIcon size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleBold().run();
        },
    },
    {
        title: "In nghiêng",
        description: "Làm nghiêng văn bản",
        searchTerms: ["italic", "nghieng"],
        icon: <ItalicIcon size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleItalic().run();
        },
    },
    {
        title: "Gạch chân",
        description: "Gạch chân văn bản",
        searchTerms: ["underline", "gachchan"],
        icon: <UnderlineIcon size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleUnderline().run();
        },
    },
    {
        title: "Gạch ngang",
        description: "Gạch ngang văn bản",
        searchTerms: ["strike", "gach"],
        icon: <Strikethrough size={18} />,
        command: ({ editor, range }: CommandProps) => {
            editor.chain().focus().deleteRange(range).toggleStrike().run();
        },
    }
];

export const slashCommand = Command.configure({
    suggestion: {
        items: () => suggestionItems,
        render: renderItems,
    },
});