'use client'

import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

interface TOCProps {
    headings: { id: string; text: string; level: number }[];
}

export default function TableOfContents({ headings }: TOCProps) {
    const { t } = useTranslation(["blog"]);

    if (!headings || headings.length === 0) return null;

    return (
        <nav className="space-y-2 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pb-4">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-4">
                {t("toc.title")}
            </p>
            <ul className="space-y-2 border-l-2 border-muted">
                {headings.map((heading, index) => (
                    <li
                        key={index}
                        className={cn(
                            "text-sm transition-all duration-200 hover:text-primary",
                            "border-l-2 -ml-0.5 border-transparent",
                            heading.level === 1 ? "pl-4 font-semibold" :
                                heading.level === 2 ? "pl-8" : "pl-12"
                        )}
                    >
                        <a
                            href={`#${heading.id}`}
                            className="block py-1 text-muted-foreground hover:text-primary transition-colors"
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.id)?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start"
                                });
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}