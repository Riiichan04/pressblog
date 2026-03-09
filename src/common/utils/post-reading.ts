export const calculateReadingTime = (content: string, wordsPerMinute: number = 200): number => {
    if (!content) return 1;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes > 0 ? minutes : 1;
};