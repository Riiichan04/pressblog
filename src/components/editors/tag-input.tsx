import React, { useState, KeyboardEvent } from 'react';
import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export const TagInput = ({ tags, onChange, placeholder }: TagInputProps) => {
    const [inputValue, setInputValue] = useState<string>("");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Enter' || e.key === ' ') && inputValue.trim()) {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (!tags.includes(newTag)) {
                onChange([...tags, newTag]);
            }
            setInputValue("");
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove: string) => {
        onChange(tags.filter(t => t !== tagToRemove));
    };

    return (
        <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-background focus-within:ring-1 focus-within:ring-ring">
            {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                        size={14}
                        className="cursor-pointer hover:text-destructive"
                        onClick={() => removeTag(tag)}
                    />
                </Badge>
            ))}
            <input
                className="flex-1 min-w-30 bg-transparent outline-none text-sm"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ""}
            />
        </div>
    );
};