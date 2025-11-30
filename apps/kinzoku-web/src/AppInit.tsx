import { useEffect } from "react";
import { useAppDispatch } from "./store/hooks";
import { setUser } from "./store/slices/authSlice";
import { api } from "./api/api";

export function AppInit() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await api.get("/user/me"); // backend reads JWT cookie
        dispatch(setUser(res.data.user));
      } catch {
        dispatch(setUser(null));
      }
    }
    fetchUser();
  }, [dispatch]);

  return null;
}
