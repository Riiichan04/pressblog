"use client";

import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Search, Plus, Save, Loader2, LayoutTemplate } from "lucide-react";
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
    arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AdminPostResponse } from "@/common/types/admin";
import { SortableItem } from "./sortable-item";

import { getAllAdminPosts, getFeaturedPosts, updateFeaturedPostsOrder } from "@/services/admin-service";

export default function FeaturedManagerPage() {
    const { t } = useTranslation("admin");
    const [searchQuery, setSearchQuery] = useState("");

    const [availablePosts, setAvailablePosts] = useState<AdminPostResponse[]>([]);
    const [featuredPosts, setFeaturedPosts] = useState<AdminPostResponse[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [featuredData, allData] = await Promise.all([
                    getFeaturedPosts(),
                    getAllAdminPosts(0, 100)
                ]);

                setFeaturedPosts(featuredData); 
                setAvailablePosts(allData.content); 
            } catch {
                toast.error(t("featured.messages.error"));
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [t]);

    const filteredAvailablePosts = useMemo(() => {
        return availablePosts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !featuredPosts.some(featured => featured.id === post.id)
        );
    }, [availablePosts, featuredPosts, searchQuery]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setFeaturedPosts((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleAddFeatured = (post: AdminPostResponse) => {
        if (featuredPosts.find(p => p.id === post.id)) {
            toast.warning(t("featured.messages.duplicate"));
            return;
        }
        setFeaturedPosts([...featuredPosts, post]);
    };

    const handleRemoveFeatured = (id: number) => {
        setFeaturedPosts(featuredPosts.filter(p => p.id !== id));
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const orderedIds = featuredPosts.map(p => p.id);
            await updateFeaturedPostsOrder(orderedIds);

            toast.success(t("featured.messages.saveSuccess"));
        } catch {
            toast.error(t("featured.messages.error"));
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        {t("featured.title")}
                    </h2>
                    <p className="text-muted-foreground mt-2">
                        {t("featured.description")}
                    </p>
                </div>
                <Button onClick={handleSaveChanges} disabled={isSaving || isLoading} className="gap-2">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {t("featured.saveConfig")}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="h-150 flex flex-col">
                    <CardHeader className="pb-3 border-b">
                        <CardTitle className="text-lg">{t("featured.leftColTitle")}</CardTitle>
                        <div className="relative mt-2">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={t("featured.searchPlaceholder")}
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
                        {isLoading ? (
                            <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                        ) : (
                            filteredAvailablePosts.map(post => (
                                <div key={post.id} className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <Button size="sm" variant="outline" onClick={() => handleAddFeatured(post)} className="shrink-0 gap-1 text-primary">
                                        <Plus className="h-4 w-4" /> {t("featured.addBtn")}
                                    </Button>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                <Card className="h-150 flex flex-col border-primary/20 shadow-md">
                    <CardHeader className="pb-3 border-b bg-primary/5">
                        <CardTitle className="text-lg flex items-center justify-between">
                            {t("featured.rightColTitle")}
                            <span className="text-xs font-normal px-2 py-1 bg-primary text-primary-foreground rounded-full">
                                {featuredPosts.length} {t("featured.postUnit")}
                            </span>
                        </CardTitle>
                        <CardDescription>{t("featured.rightColDesc")}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 bg-muted/10">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={featuredPosts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                {featuredPosts.map((post) => (
                                    <SortableItem
                                        key={post.id}
                                        post={post}
                                        onRemove={handleRemoveFeatured}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>

                        {!isLoading && featuredPosts.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-6">
                                <LayoutTemplate className="h-10 w-10 mb-2 opacity-50" />
                                <p>{t("featured.emptyCarousel")}</p>
                                <p className="text-sm">{t("featured.emptyCarouselHint")}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}