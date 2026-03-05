"use client";

import { ReactNode, useSyncExternalStore } from "react";
import "@/lib/i18n";

const emptySubscribe = () => () => { };

export default function I18nProvider({ children }: { children: ReactNode }) {
    const isClient = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false
    );

    if (!isClient) {
        return <div style={{ visibility: "hidden" }}>{children}</div>;
    }

    return <>{children}</>;
}