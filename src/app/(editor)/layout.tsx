import EditorNavbar from "@/components/editors/nav-bar";

export default function WritePostLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <EditorNavbar />
            {children}
        </div>
    )
}