import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { api } from "../api/api";
import { logout } from "@kizo/store";

const LANDING_URL = import.meta.env.VITE_LANDING_URL;

export function useAppNavigation() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return {
    // 🔁 Internal SPA navigation
    goToProfile: () => navigate("/profile"),
    goToSignIn: () => navigate("/auth/signin"),
    goToSignUp: () => navigate("/auth/signup"),
    goToForgotPassword: () => navigate("/auth/forgot-password"),
    goToDashboard: () => navigate("/dashboard"),
    goToPayment: () => navigate("/payment"),
    goToTransactions: () => navigate("/transactions"),
    goToTransactionDetails: (id: string) => navigate(`/transaction/${id}`),

    // 🌍 Cross-app navigation (Astro landing)
    goHome: () => {
      window.location.href = LANDING_URL;
    },

    // 🔐 Logout (FINAL + CORRECT)
    logout: async () => {
      try {
        await api.post("/auth/logout");
      } catch {
        // ignore — cookies may already be gone
      } finally {
        // ✅ Clear Redux auth state
        dispatch(logout());

        // ✅ Hard redirect (kills memory + prevents back nav)
        window.location.href = LANDING_URL;
      }
    },
  };
}
