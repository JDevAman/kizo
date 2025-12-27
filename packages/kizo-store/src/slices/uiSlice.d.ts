export interface Toast {
    id: string;
    title: string;
    description?: string;
    variant?: "default" | "destructive";
}
export interface UIState {
    toasts: Toast[];
}
export declare const addToast: import("@reduxjs/toolkit").ActionCreatorWithPayload<Omit<Toast, "id">, "ui/addToast">, removeToast: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "ui/removeToast">;
declare const _default: import("redux").Reducer<UIState>;
export default _default;
//# sourceMappingURL=uiSlice.d.ts.map