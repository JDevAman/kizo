import type { User } from "@kizo/shared";
export interface AuthState {
    user: User | null;
    signupEmail: string | null;
    loading: boolean;
}
export declare const setUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar: string | null;
} | null, "auth/setUser">, logout: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"auth/logout">, setSignupEmail: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "auth/setSignupEmail">, startLoading: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"auth/startLoading">;
declare const _default: import("redux").Reducer<AuthState>;
export default _default;
//# sourceMappingURL=authSlice.d.ts.map