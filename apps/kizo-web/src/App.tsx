import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { DashboardPage } from "./pages/dashboard/Dashboard";
import { PaymentPage } from "./pages/payment/Payment";
import { Layout } from "./components/Layout";
import { TransactionsPage } from "./pages/transaction/Transaction";
import { NotFoundPage } from "./pages/NotFoundPage";
import { AuthPage } from "./pages/auth/auth";
import { ForgotPasswordPage } from "./pages/auth/forgotPassword";
import { ReduxToast } from "./components/toast";
import { TransactionDetailsPage } from "./pages/transaction/TransactionDetail";
import ProfilePage from "./pages/profile/Profile";
import { useAppSelector } from "./store/hooks";
import { AppInit } from "./AppInit";

function AppRoutes() {
  return (
    <div className="min-h-screen bg-black">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/auth/signin" replace />} />
          <Route path="/auth/*" element={<AuthPage />} />

          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<Layout protectedPage={true} />}>
          <Route path="payment" element={<PaymentPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="transactions" element={<TransactionsPage />} />
          <Route path="/transaction/:id" element={<TransactionDetailsPage />} />
        </Route>
      </Routes>
    </div>
  );
}


function App() {
  const { authChecked } = useAppSelector((s) => s.auth);

  return (
    <Router>
      <AppInit />

      {!authChecked ? (
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          Loading...
        </div>
      ) : (
        <>
          <AppRoutes />
          <ReduxToast />
        </>
      )}
    </Router>
  );
}

export default App;
