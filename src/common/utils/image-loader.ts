"use client"

import { ImageLoaderProps } from "next/image"

const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_STORAGE

export const imageLoader = (
    { src, width, quality }: ImageLoaderProps
) => {
    return `${mediaUrl}/${src}?w=${width}&q=${quality || 75}`
}