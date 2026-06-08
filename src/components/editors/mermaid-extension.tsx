import { NodeViewWrapper, ReactNodeViewRenderer, type NodeViewProps } from '@tiptap/react';
import { Node, mergeAttributes } from '@tiptap/core';
import mermaid from 'mermaid';
import { useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';

//TODO: Add i18n for Mermaid
const MermaidNodeView = ({ node, updateAttributes }: NodeViewProps) => {
    const code = node.attrs.code;
    const [svg, setSvg] = useState('');
    const [error, setError] = useState(false);

    const [mode, setMode] = useState<'code' | 'preview' | 'both'>('code');

    useEffect(() => {
        mermaid.initialize({ startOnLoad: false, theme: 'default' });

        const renderMermaid = async () => {
            try {
                if (code.trim()) {
                    const id = 'mermaid-' + Math.random().toString(36).substr(2, 9);
                    const { svg } = await mermaid.render(id, code);
                    setSvg(svg);
                    setError(false);
                } else {
                    setSvg('');
                }
            } catch {
                setError(true);
            }
        };
        renderMermaid();
    }, [code]);

    return (
        <NodeViewWrapper className="my-6">
            <div className="relative flex flex-col gap-2 rounded-md border border-border bg-muted/20 p-4" contentEditable={false}>

                <div className="flex items-center justify-between border-b border-border/60 pb-2 mb-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none">
                        Mermaid Diagram
                    </span>
                    <div className="flex items-center bg-muted p-0.5 rounded-md border border-border/40 text-xs select-none">
                        <button
                            type="button"
                            onClick={() => setMode('code')}
                            className={`px-2.5 py-1 rounded-sm font-medium transition-all ${mode === 'code' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Code
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('preview')}
                            className={`px-2.5 py-1 rounded-sm font-medium transition-all ${mode === 'preview' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Preview
                        </button>
                        <button
                            type="button"
                            onClick={() => setMode('both')}
                            className={`px-2.5 py-1 rounded-sm font-medium transition-all ${mode === 'both' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            Both
                        </button>
                    </div>
                </div>

                {(mode === 'code' || mode === 'both') && (
                    <Textarea
                        className="w-full min-h-25 rounded-md bg-stone-900 text-stone-100 p-5 font-mono! text-sm outline-none focus:ring-2 focus:ring-primary resize-y leading-relaxed"
                        style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}
                        spellCheck={false}
                        value={code}
                        onChange={(e) => updateAttributes({ code: e.target.value })}
                        placeholder="Gõ code Mermaid vào đây (vd: graph TD; A-->B;)"
                    />
                )}

                {(mode === 'preview' || mode === 'both') && (
                    error ? (
                        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive font-medium border border-destructive/20">
                            Lỗi cú pháp Mermaid! Không thể render sơ đồ.
                        </div>
                    ) : (
                        svg ? (
                            <div
                                className="mt-1 flex justify-center rounded-md bg-white p-5 overflow-x-auto border border-border/40 shadow-sm"
                                dangerouslySetInnerHTML={{ __html: svg }}
                            />
                        ) : (
                            <div className="text-center p-5 text-sm text-muted-foreground italic bg-background/40 rounded-md border border-dashed">
                                Sơ đồ trống. Hãy nhập mã code Mermaid để render.
                            </div>
                        )
                    )
                )}
            </div>
        </NodeViewWrapper>
    );
};

export const MermaidExtension = Node.create({
    name: 'mermaid',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            code: {
                default: 'graph TD\n  A-->B;\n  A-->C;',
            },
        };
    },

    parseHTML() {
        return [{ tag: 'div[data-type="mermaid"]' }];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'mermaid' })];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MermaidNodeView);
    },
});