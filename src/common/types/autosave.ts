export interface AutosaveConfig<T> {
    onSave: (data: T) => Promise<void> | void;
    delay?: number;
}