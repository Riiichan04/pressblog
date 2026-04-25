import DOMPurify from 'dompurify'

export const purifyBlogContent = (content: string) => {
    return DOMPurify.sanitize(content)
}