import type { User } from "@kizo/shared";
export interface AuthState {
    user: User | null;
    loading: boolean;
    authChecked: boolean;
}
export declare const setUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar: string | null;
} | null, "auth/setUser">, logout: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"auth/logout">, startLoading: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"auth/startLoading">;
declare const _default: import("redux").Reducer<AuthState>;
export default _default;
//# sourceMappingURL=authSlice.d.ts.map