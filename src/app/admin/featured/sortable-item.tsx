import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { AdminPostResponse } from "@/common/types/admin";
import { Button } from "@/components/ui/button";

interface SortableItemProps {
    post: AdminPostResponse;
    onRemove: (id: number) => void;
}

export function SortableItem({ post, onRemove }: SortableItemProps) {
    const {
        attributes, listeners, setNodeRef, transform, transition, isDragging
    } = useSortable({ id: post.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-3 p-3 mb-2 bg-background border rounded-lg shadow-sm hover:border-primary/50 transition-colors"
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 text-muted-foreground hover:text-foreground"
            >
                <GripVertical className="h-5 w-5" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm line-clamp-1">{post.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{post.authorName}</p>
            </div>

            <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(post.id)}
                className="text-red-500 hover:text-red-600 hover:bg-red-50 h-8 w-8 shrink-0"
            >
                <X className="h-4 w-4" />
            </Button>
        </div>
    );
}