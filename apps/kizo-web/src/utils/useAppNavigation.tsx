import { useNavigate } from "react-router-dom";

const LANDING_URL = import.meta.env.VITE_LANDING_URL

export function useAppNavigation() {
  const navigate = useNavigate();

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

    // 🌍 Cross-app navigation (Astro)
    goHome: () => {
      window.location.href = LANDING_URL;
    },

    logout: () => {
      window.location.href = LANDING_URL;
    },
  };
}
