import { configureStore } from "@reduxjs/toolkit";
import editorReducer from '@/store/slices/editor-slice'
import postReducer from '@/store/slices/post-slice'

export const store = configureStore({
    reducer: {
        editor: editorReducer,
        post: postReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;