import { configureStore } from "@reduxjs/toolkit";
import editorReducer from '@/store/slices/editor-slice'
import postReducer from '@/store/slices/post-slice'
import authReducer from '@/store/slices/auth-slice'

export const store = configureStore({
    reducer: {
        editor: editorReducer,
        post: postReducer,
        auth: authReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;