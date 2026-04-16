import { useEffect, useRef, useCallback } from "react";
import { debounce } from "lodash";

export function useAutosave<T>(onSave: (data: T) => Promise<void> | void, delay = 3000) {
    const onSaveRef = useRef(onSave);
    useEffect(() => {
        onSaveRef.current = onSave;
    }, [onSave]);

    const debouncedRef = useRef<ReturnType<typeof debounce>>(null);

    useEffect(() => {
        const handler = debounce(async (data: T) => {
            await onSaveRef.current(data);
        }, delay);

        debouncedRef.current = handler;

        return () => {
            handler.cancel();
        };
    }, [delay]);

    const triggerSave = useCallback((data: T) => {
        if (debouncedRef.current) {
            debouncedRef.current(data);
        }
    }, []);

    return { triggerSave };
}