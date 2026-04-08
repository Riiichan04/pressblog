import { PostRequest } from "@/common/types/post";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
    post: PostRequest,
    updatedAt: number,
    isPublishRequested: boolean,
    canPublish: boolean
} = {
    post: {} as PostRequest,
    updatedAt: Date.now(),
    isPublishRequested: false,
    canPublish: false
}


const postSlice = createSlice({
    name: "savedPost",
    initialState,
    reducers: {
        savePost: (state, action: PayloadAction<{ post: PostRequest, updatedAt: number }>) => {
            state.post = action.payload.post;
            state.updatedAt = action.payload.updatedAt
        },
        requestPublish: (state) => {
            state.isPublishRequested = true;
        },
        resetPublishRequest: (state) => {
            state.isPublishRequested = false;
        },
        setCanPublish: (state, action: PayloadAction<boolean>) => {
            state.canPublish = action.payload;
        }
    }
})

export default postSlice.reducer
export const { savePost, requestPublish, resetPublishRequest, setCanPublish } = postSlice.actions