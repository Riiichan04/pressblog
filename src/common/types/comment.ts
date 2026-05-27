export interface CommentResponse {
    id: number;
    postId: number;
    authorAvatar: string | null;
    authorDisplayName: string;
    content: string;
    upvote: number;
    downvote: number;
    parentId: number | null;
    replyCount: number;
    createdAt: string;
}

export interface CommentRequest {
    postId: number;
    authorId: number;
    content: string;
    commentId?: number | null;
}