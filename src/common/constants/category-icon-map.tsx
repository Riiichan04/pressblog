import {
    Palette,
    Coffee,
    Plane,
    Library,
    Utensils,
    Camera,
    Cpu,
    LucideIcon
} from "lucide-react";

export const categoryIconMap: Record<string, { icon: LucideIcon, color: string, bgColor: string }> = {
    "technology": {
        icon: Cpu,
        color: "text-primary-500",
        bgColor: "bg-primary-500/10"
    },
    "design": {
        icon: Palette,
        color: "text-primary-500",
        bgColor: "bg-primary-500/10"
    },
    "slice-of-life": {
        icon: Coffee,
        color: "text-primary-500",
        bgColor: "bg-primary-500/10"
    },
    "travel": {
        icon: Plane,
        color: "text-primary-500",
        bgColor: "bg-primary-500/10"
    },
    "resource-hub": {
        icon: Library,
        color: "text-primary-500",
        bgColor: "bg-primary-500/10"
    },
    "food": {
        icon: Utensils,
        color: "text-primary-500",
        bgColor: "bg-primary-500/10"
    },
    "photography": {
        icon: Camera,
        color: "text-primary-500",
        bgColor: "bg-primary-500/10"
    }
};