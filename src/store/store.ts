import { configureStore } from "@reduxjs/toolkit";
import editorReducer from '@/store/slices/editor-slice'
import postReducer from '@/store/slices/post-slice'
import authReducer from '@/store/slices/auth-slice'
import notificationReducer from '@/store/slices/notification-slice'

export const store = configureStore({
    reducer: {
        editor: editorReducer,
        post: postReducer,
        auth: authReducer,
        notification: notificationReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;