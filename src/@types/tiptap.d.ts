import '@tiptap/core'
import { EditorView } from '@tiptap/pm/view'
import { EditorState } from '@tiptap/pm/state'

declare module '@tiptap/core' {
    interface Editor {
        className: string
        editorView: EditorView
        editorState: EditorState
        instanceId: string

        toggleBulletList: () => boolean
        toggleUnderline: () => boolean
        toggleTaskList: () => boolean
        toggleBlockquote: () => boolean
    }

    interface Commands<ReturnType> {
        bulletList: {
            toggleBulletList: () => ReturnType
        }
        taskList: {
            toggleTaskList: () => ReturnType
        }
        blockquote: {
            toggleBlockquote: () => ReturnType
        }
        underline: {
            toggleUnderline: () => ReturnType
        }
    }


}