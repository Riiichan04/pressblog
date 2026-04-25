import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type EditorTool =
    | 'bold' | 'italic' | 'underline' | 'strike'
    | 'heading1' | 'heading2' | 'heading3' | 'heading4' | 'heading5' | 'heading6'
    | 'bulletList' | 'orderedList' | 'blockquote' | 'codeBlock' | 'link';

interface EditorState {
    activeTools: Partial<Record<EditorTool, boolean>>;
}

const initialState: EditorState = {
    activeTools: {},
};

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        setFullState: (state, action: PayloadAction<Partial<Record<EditorTool, boolean>>>) => {
            state.activeTools = action.payload;
        },
    },
});

export const { setFullState } = editorSlice.actions;
export default editorSlice.reducer;