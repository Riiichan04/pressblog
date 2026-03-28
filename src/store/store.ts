import { configureStore } from "@reduxjs/toolkit";
import editorReducer from '../store/slices/editor-slice'

export const store = configureStore({
    reducer: {
        editor: editorReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;