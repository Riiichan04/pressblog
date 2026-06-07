"use client";

import React, { useState, KeyboardEvent } from 'react';
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface TagInputProps {
    initialTags?: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export const TagInput = ({ initialTags = [], onChange, placeholder }: TagInputProps) => {
    const [tags, setTags] = useState<string[]>(initialTags);
    const [inputValue, setInputValue] = useState<string>("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ' ') && inputValue.trim()) {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (!tags.includes(newTag)) {
                const newTags = [...tags, newTag];
                setTags(newTags);
                onChange(newTags);
            }
            setInputValue("");
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            const newTags = tags.slice(0, -1);
            setTags(newTags);
            onChange(newTags);
        }
    };

    const removeTag = (tagToRemove: string) => {
        const newTags = tags.filter(t => t !== tagToRemove);
        setTags(newTags);
        onChange(newTags);
    };

    return (
        <div className="flex flex-wrap items-center gap-1.5 w-full md:max-w-md bg-transparent hover:bg-muted/50 focus-within:bg-muted/50 transition-colors rounded-sm px-2 min-h-8 cursor-text">
            {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 font-normal h-5 px-1.5 text-xs">
                    {tag}
                    <X
                        size={12}
                        className="cursor-pointer hover:text-destructive opacity-70 hover:opacity-100"
                        onClick={() => removeTag(tag)}
                    />
                </Badge>
            ))}
            <input
                className="flex-1 min-w-20 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ""}
            />
        </div>
    );
};