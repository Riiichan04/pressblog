import { type EditorInstance } from "novel";
import {
    BoldIcon, ItalicIcon, UnderlineIcon, CodeIcon,
    Strikethrough, Heading1, Heading2, Heading3, Heading4, Heading5, Heading6,
    List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon, LinkIcon
} from "lucide-react";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { EditorTool } from "@/store/slices/editor-slice";

export const ClassicToolbar = ({ editor }: { editor: EditorInstance | null }) => {
    const activeTools = useSelector((state: RootState) => state.editor.activeTools);
    if (!editor) return null;

    const exec = (action: () => void) => {
        action();
        setTimeout(() => editor.commands.focus(), 0);
    };

    const getBtnClass = (toolName: EditorTool) => {
        const isActiveInRedux = activeTools[toolName];

        const isActiveInEditor = toolName.startsWith('heading')
            ? editor.isActive('heading', { level: parseInt(toolName.replace('heading', '')) })
            : editor.isActive(toolName === 'bulletList' ? 'bulletList' : toolName === 'orderedList' ? 'orderedList' : toolName);

        if (isActiveInRedux || isActiveInEditor) {
            return "p-2 rounded-md bg-muted text-foreground transition-colors shadow-sm";
        }
        return "p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors";
    };

    return (
        <div className="flex flex-wrap items-center gap-1 border-b border-border bg-background/50 p-2 mb-2 rounded-t-lg">
            {/* isSingle = false */}
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleBold().run())} className={getBtnClass("bold")}><BoldIcon size={16} /></button>
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleItalic().run())} className={getBtnClass("italic")}><ItalicIcon size={16} /></button>
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleUnderline().run())} className={getBtnClass("underline")}><UnderlineIcon size={16} /></button>
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleStrike().run())} className={getBtnClass("strike")}><Strikethrough size={16} /></button>

            <div className="w-px h-6 bg-border mx-1" />

            {/* isSingle = true */}
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleHeading({ level: 1 }).run())} className={getBtnClass("heading1")}><Heading1 size={16} /></button>
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleHeading({ level: 2 }).run())} className={getBtnClass("heading2")}><Heading2 size={16} /></button>
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleHeading({ level: 3 }).run())} className={getBtnClass("heading3")}><Heading3 size={16} /></button>
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleHeading({ level: 4 }).run())} className={getBtnClass("heading4")}><Heading4 size={16} /></button>
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleHeading({ level: 5 }).run())} className={getBtnClass("heading5")}><Heading5 size={16} /></button>
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleHeading({ level: 6 }).run())} className={getBtnClass("heading6")}><Heading6 size={16} /></button>

            <div className="w-px h-6 bg-border mx-1" />

            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleBulletList().run())} className={getBtnClass("bulletList")}><List size={16} /></button>
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleOrderedList().run())} className={getBtnClass("orderedList")}><ListOrdered size={16} /></button>
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleBlockquote().run())} className={getBtnClass("blockquote")}><Quote size={16} /></button>
            <button type="button" onClick={() => exec(() => editor.chain().focus().toggleCodeBlock().run())} className={getBtnClass("codeBlock")}><CodeIcon size={16} /></button>

            <div className="w-px h-6 bg-border mx-1" />

            <button type="button" onClick={() => exec(() => editor.chain().focus().insertContent("[Link](https://)").run())} className="p-2 rounded-md text-muted-foreground hover:bg-muted"><LinkIcon size={16} /></button>
            <button type="button" onClick={() => document.getElementById("editor-image-upload")?.click()} className="p-2 rounded-md text-muted-foreground hover:bg-muted"><ImageIcon size={16} /></button>
            
            <div className="w-px h-6 bg-border mx-1" />

            <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30"><Undo size={16} /></button>
            <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors disabled:opacity-30"><Redo size={16} /></button>
        </div>
    );
};