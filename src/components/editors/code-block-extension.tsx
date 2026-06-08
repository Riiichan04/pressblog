import { NodeViewContent, NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from '@tiptap/react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { all, createLowlight } from 'lowlight';
import { CODE_BLOCK_LANGUAGES } from '@/common/constants/code-languages';

const lowlight = createLowlight(all);

const CodeBlockReactView = ({ node, updateAttributes }: NodeViewProps) => {
    const currentLang = node.attrs.language || 'auto';

    return (
        <NodeViewWrapper className="relative my-6 group">
            <div className="absolute right-3 top-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200" contentEditable={false}>
                <select
                    value={currentLang}
                    onChange={(e) => updateAttributes({ language: e.target.value })}
                    className="bg-stone-800/90 text-stone-300 border border-stone-700/50 rounded px-2 py-1 text-xs outline-none cursor-pointer hover:bg-stone-700 hover:text-white transition-colors"
                >
                    {CODE_BLOCK_LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value} className="bg-stone-900 text-stone-200">
                            {lang.label}
                        </option>
                    ))}
                </select>
            </div>

            <pre className="rounded-md bg-stone-900 text-stone-100 p-5 font-mono text-sm leading-relaxed overflow-x-auto relative">
                <code spellCheck={false}>
                    <NodeViewContent />
                </code>
            </pre>
        </NodeViewWrapper>
    );
};

export const CustomCodeBlockExtension = CodeBlockLowlight.extend({
    addNodeView() {
        return ReactNodeViewRenderer(CodeBlockReactView);
    },
}).configure({
    lowlight,
});