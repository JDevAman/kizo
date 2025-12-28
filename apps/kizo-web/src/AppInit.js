import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { setUser, startLoading } from "@kizo/store";
import { api } from "./api/api";
export function AppInit() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        let cancelled = false;
        async function bootstrapAuth() {
            dispatch(startLoading());
            try {
                const res = await api.get("/user/me");
                if (!cancelled) {
                    dispatch(setUser(res.data.user));
                }
            }
            catch {
                // 401 is VALID → user not logged in
                if (!cancelled) {
                    dispatch(setUser(null));
                }
            }
        }
        bootstrapAuth();
        return () => {
            cancelled = true;
        };
    }, [dispatch]);
    return null;
}
