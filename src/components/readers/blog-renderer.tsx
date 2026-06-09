"use client";

import { useEffect, useRef } from "react";
import mermaid from "mermaid";
import hljs from "highlight.js";
import { CODE_BLOCK_LANGUAGES } from "@/common/constants/code-languages";
import { useTranslation } from "react-i18next";

interface PostRendererProps {
    markdownContent: string;
}

export default function PostRenderer({ markdownContent }: PostRendererProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation("editor")

    useEffect(() => {
        if (!contentRef.current) return;

        contentRef.current.innerHTML = markdownContent || "";
        const processMermaid = async (block: HTMLElement, isTiptap: boolean) => {
            const code = isTiptap ? block.getAttribute('code') || '' : block.textContent || '';
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;

            const container = document.createElement('div');
            container.className = "not-prose my-6 flex flex-col gap-2 rounded-md border border-border bg-muted/20 p-4";

            try {
                mermaid.initialize({ startOnLoad: false, theme: 'default' });
                const { svg } = await mermaid.render(id, code);

                container.innerHTML = `
                <div class="flex items-center justify-between border-b border-border/60 pb-2 mb-1">
                    <span class="text-xs font-semibold text-muted-foreground uppercase tracking-wider select-none">Mermaid Diagram</span>
                    <div class="flex items-center bg-muted p-0.5 rounded-md border border-border/40 text-xs select-none">
                        <button type="button" class="btn-code px-2 py-1 rounded-sm font-medium text-muted-foreground hover:text-foreground">${t("mermaid.mode_code")}</button>
                        <button type="button" class="btn-preview px-2 py-1 rounded-sm font-medium bg-background text-foreground shadow-sm">${t("mermaid.mode_preview")}</button>
                        <button type="button" class="btn-both px-2 py-1 rounded-sm font-medium text-muted-foreground hover:text-foreground">${t("mermaid.mode_both")}</button>
                    </div>
                </div>
                <div class="view-code hidden"><pre class="bg-muted p-5 rounded-md font-mono text-sm overflow-x-auto">${code.replace(/</g, '&lt;')}</pre></div>
                <div class="view-preview flex justify-center p-5 bg-background rounded-md">${svg}</div>
            `;
            } catch {
                container.innerHTML = `<div class="p-4 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20">${t("mermaid.error")}</div>`;
            }

            const btnCode = container.querySelector('.btn-code')!;
            const btnPreview = container.querySelector('.btn-preview')!;
            const btnBoth = container.querySelector('.btn-both')!;
            const viewCode = container.querySelector('.view-code')!;
            const viewPreview = container.querySelector('.view-preview')!;

            const update = (mode: string) => {
                viewCode.classList.toggle('hidden', mode === 'preview');
                viewPreview.classList.toggle('hidden', mode === 'code');
                [btnCode, btnPreview, btnBoth].forEach(b => b.classList.remove('bg-background', 'shadow-sm'));
                (mode === 'code' ? btnCode : mode === 'preview' ? btnPreview : btnBoth).classList.add('bg-background', 'shadow-sm');
            };

            btnCode.addEventListener('click', () => update('code'));
            btnPreview.addEventListener('click', () => update('preview'));
            btnBoth.addEventListener('click', () => update('both'));

            block.parentNode?.replaceChild(container, block);
        };

        const allPre = contentRef.current.querySelectorAll('pre');
        allPre.forEach(pre => {
            const code = pre.querySelector('code');
            if (!code) return;

            const isMermaid = code.classList.contains('language-mermaid') || code.textContent?.includes('graph TD');

            if (isMermaid) {
                processMermaid(code, false);
            } else {
                const langClass = Array.from(code.classList).find(c => c.startsWith('language-')) || 'language-auto';
                const lang = langClass.replace('language-', '');

                const wrapper = document.createElement('div');
                wrapper.className = "not-prose my-6 rounded-md bg-[#0d1117] relative group";

                const select = document.createElement('select');
                select.className = "absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 bg-stone-800 text-white text-xs p-1 rounded";
                CODE_BLOCK_LANGUAGES.forEach(l => {
                    const opt = document.createElement('option');
                    opt.value = l.value; opt.textContent = l.label;
                    if (l.value === lang) opt.selected = true;
                    select.appendChild(opt);
                });

                code.classList.add('hljs');
                hljs.highlightElement(code);

                pre.parentNode?.insertBefore(wrapper, pre);
                wrapper.appendChild(select);
                wrapper.appendChild(pre);
            }
        });

    }, [markdownContent, t]);

    return (
        <article
            ref={contentRef}
            className="prose dark:prose-invert max-w-none w-full"
        />
    );
}