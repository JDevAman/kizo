import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate, } from "react-router-dom";
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
    return (_jsx("div", { className: "min-h-screen bg-black", children: _jsxs(Routes, { children: [_jsxs(Route, { element: _jsx(Layout, {}), children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/auth/signin", replace: true }) }), _jsx(Route, { path: "/auth/*", element: _jsx(AuthPage, {}) }), _jsx(Route, { path: "/auth/forgot-password", element: _jsx(ForgotPasswordPage, {}) }), _jsx(Route, { path: "*", element: _jsx(NotFoundPage, {}) })] }), _jsxs(Route, { element: _jsx(Layout, { protectedPage: true }), children: [_jsx(Route, { path: "payment", element: _jsx(PaymentPage, {}) }), _jsx(Route, { path: "profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "dashboard", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "transactions", element: _jsx(TransactionsPage, {}) }), _jsx(Route, { path: "/transaction/:id", element: _jsx(TransactionDetailsPage, {}) })] })] }) }));
}
function App() {
    const { authChecked } = useAppSelector((s) => s.auth);
    return (_jsxs(Router, { children: [_jsx(AppInit, {}), !authChecked ? (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-black text-white", children: "Loading..." })) : (_jsxs(_Fragment, { children: [_jsx(AppRoutes, {}), _jsx(ReduxToast, {})] }))] }));
}
export default App;
