import { useNavigate } from "react-router-dom";
export function useAppNavigation() {
  const navigate = useNavigate();

  return {
    goHome: () => navigate("/"),
    goToProfile: () => navigate("/profile"),
    goToSignIn: () => navigate("/auth/signin"),
    goToSignUp: () => navigate("/auth/signup"),
    goToForgotPassword: () => navigate("/auth/forgot-password"),
    goToDashboard: () => navigate("/dashboard"),
    goToPayment: () => navigate("/payment"),
    goToTransactions: () => navigate("/transaction"),
    goToTransactionDetails: (id: string) => navigate(`/transactions/${id}`),
    goToSuccess: () => navigate("/success"),
    goToFeatures: () => navigate("/features"),
    goToAbout: () => navigate("/about"),
    goToSupport: () => navigate("/support"),
    goToRequests: () => navigate("/request"),
    logout: () => navigate("/"),
  };
}
