import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Button, InputField, TabButton } from "@kizo/ui";
import { AuthCard } from "../../../../../packages/ui/src/components/AuthCard";
import { useLocation } from "react-router-dom";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { useAppDispatch } from "../../store/hooks";
import { setUser } from "@kizo/store";
import { api } from "../../api/api";
import { regex } from "../../utils/utils";
import { ShieldCheck, Zap, Globe, ArrowRight } from "lucide-react";
export function AuthPage() {
    const { goToDashboard, goToSignIn, goToSignUp } = useAppNavigation();
    const { pathname } = useLocation();
    const dispatch = useAppDispatch();
    // ---------------- State  ----------------
    const [activeTab, setActiveTab] = useState("signin");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
    });
    const [fieldErrors, setFieldErrors] = useState({});
    const [fieldValid, setFieldValid] = useState({
        email: false,
        password: false,
        confirmPassword: false,
        firstName: false,
        lastName: false,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // ---------------- Sync tab with URL  ----------------
    useEffect(() => {
        setActiveTab(pathname.includes("signup") ? "signup" : "signin");
    }, [pathname]);
    // ---------------- Validation  ----------------
    const handleFieldChange = (field) => (e) => {
        const value = e.target.value.trim();
        setFormData((prev) => ({ ...prev, [field]: value }));
        const update = (valid, msg = "") => {
            setFieldErrors((p) => ({ ...p, [field]: msg }));
            setFieldValid((p) => ({ ...p, [field]: valid }));
        };
        switch (field) {
            case "email":
                update(regex.email.test(value), value && !regex.email.test(value) ? "Invalid email" : "");
                break;
            case "password":
                update(regex.password.test(value), value && !regex.password.test(value)
                    ? "6+ chars, letters & numbers"
                    : "");
                break;
            case "confirmPassword":
                update(value === formData.password, "Passwords do not match");
                break;
            case "firstName":
            case "lastName":
                update(value.length >= 2 && value.length <= 20, "2–20 chars required");
                break;
        }
    };
    const isFormValid = useMemo(() => {
        if (activeTab === "signin")
            return fieldValid.email && fieldValid.password;
        return Object.values(fieldValid).every(Boolean);
    }, [activeTab, fieldValid]);
    // ---------------- Submit  ----------------
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!isFormValid)
            return;
        setError("");
        setLoading(true);
        try {
            await api.post(`auth/${activeTab}`, {
                email: formData.email,
                password: formData.password,
                ...(activeTab === "signup" && {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                }),
            });
            const meRes = await api.get("/user/me");
            dispatch(setUser(meRes.data.user));
            goToDashboard();
        }
        catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        }
        finally {
            setLoading(false);
        }
    }, [activeTab, formData, dispatch, goToDashboard, isFormValid]);
    return (_jsxs("div", { className: "min-h-screen bg-black flex overflow-hidden", children: [_jsxs("div", { className: "hidden lg:flex lg:w-[40%] h-screen sticky top-0 bg-[#0a0a0c] flex-col justify-center px-16 border-r border-white/5", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" }), _jsxs("div", { className: "relative z-10", children: [_jsxs("div", { className: "mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider", children: [_jsx(Zap, { className: "w-3 h-3" }), "Simplifying Finance"] }), _jsxs("h2", { className: "text-4xl font-light text-white leading-tight mb-10", children: ["Experience the", " ", _jsx("span", { className: "text-cyan-400 font-medium", children: "next generation" }), " ", "of digital finance."] }), _jsxs("div", { className: "space-y-8", children: [_jsx(FeatureItem, { icon: _jsx(ShieldCheck, { className: "w-5 h-5 text-cyan-400" }), title: "Secure by Design", desc: "Bank-grade security protecting your assets." }), _jsx(FeatureItem, { icon: _jsx(Globe, { className: "w-5 h-5 text-cyan-400" }), title: "Global Access", desc: "Operate seamlessly across borders." })] }), _jsxs("div", { className: "mt-16 pt-8 border-t border-white/5 text-slate-500 text-sm", children: ["Trusted by ", _jsx("span", { className: "text-white", children: "10k+" }), " users"] })] })] }), _jsx("div", { className: "flex-1 h-screen overflow-y-auto bg-black", children: _jsx("div", { className: "min-h-full flex items-center justify-center p-8", children: _jsxs("div", { className: "w-full max-w-[520px]", children: [_jsxs("div", { className: "flex bg-slate-900/50 p-1 rounded-xl mb-8 border border-white/5", children: [_jsx(TabButton, { tab: "signin", activeTab: activeTab, onClick: () => {
                                            goToSignIn();
                                            setActiveTab("signin");
                                        }, label: "Sign In", className: "flex-1" }), _jsx(TabButton, { tab: "signup", activeTab: activeTab, onClick: () => {
                                            goToSignUp();
                                            setActiveTab("signup");
                                        }, label: "Sign Up", className: "flex-1" })] }), _jsx(AuthCard, { title: activeTab === "signin" ? "Welcome Back" : "Create Account", subtitle: activeTab === "signin"
                                    ? "Sign in to your account"
                                    : "Join Kizo today", children: _jsxs("form", { onSubmit: handleSubmit, className: "space-y-5", children: [activeTab === "signup" && (_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsx(InputField, { label: "First Name", value: formData.firstName, onChange: handleFieldChange("firstName"), error: fieldErrors.firstName }), _jsx(InputField, { label: "Last Name", value: formData.lastName, onChange: handleFieldChange("lastName"), error: fieldErrors.lastName })] })), _jsx(InputField, { type: "email", label: "Email", value: formData.email, onChange: handleFieldChange("email"), error: fieldErrors.email }), _jsx(InputField, { type: "password", label: "Password", value: formData.password, onChange: handleFieldChange("password"), error: fieldErrors.password }), activeTab === "signup" && (_jsx(InputField, { type: "password", label: "Confirm Password", value: formData.confirmPassword, onChange: handleFieldChange("confirmPassword"), error: fieldErrors.confirmPassword })), error && _jsx("p", { className: "text-red-500 text-sm", children: error }), _jsxs(Button, { type: "submit", variant: isFormValid ? "glow" : "default", className: "w-full flex items-center justify-center gap-2", disabled: !isFormValid || loading, children: [loading
                                                    ? "Please wait..."
                                                    : activeTab === "signin"
                                                        ? "Sign In"
                                                        : "Get Started", !loading && _jsx(ArrowRight, { className: "w-4 h-4" })] })] }) })] }) }) })] }));
}
// ---------------- Feature Item ----------------
function FeatureItem({ icon, title, desc, }) {
    return (_jsxs("div", { className: "flex gap-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center", children: icon }), _jsxs("div", { children: [_jsx("h4", { className: "text-white text-sm font-medium", children: title }), _jsx("p", { className: "text-slate-500 text-xs", children: desc })] })] }));
}
