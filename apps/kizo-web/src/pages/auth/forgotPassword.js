import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, InputField } from "@kizo/ui";
import { AuthCard } from "../../../../../packages/ui/src/components/AuthCard";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { regex } from "../../utils/utils";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { useAppDispatch } from "../../store/hooks";
import { addToast } from "@kizo/store";
export function ForgotPasswordPage() {
    const { goToSignIn } = useAppNavigation();
    const [email, setEmail] = useState("");
    const [fieldError, setFieldError] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const dispatch = useAppDispatch();
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
        if (!value.trim())
            setFieldError("Email is required");
        else if (!regex.email.test(value.trim()))
            setFieldError("Invalid email address");
        else
            setFieldError("");
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const trimmedEmail = email.trim();
        if (!regex.email.test(trimmedEmail))
            return;
        setSending(true);
        try {
            await new Promise((r) => setTimeout(r, 1200));
            setSent(true);
            dispatch(addToast({
                title: "Reset link sent",
                description: `We've emailed a secure link to ${trimmedEmail}.`,
            }));
        }
        catch {
            dispatch(addToast({
                title: "Something went wrong",
                description: "Please try again.",
                variant: "destructive",
            }));
        }
        finally {
            setSending(false);
        }
    };
    const isFormValid = !fieldError && email.trim().length > 0;
    const cardTitle = sent ? "Check your email" : "Forgot Password";
    const cardSubtitle = sent
        ? "We've sent a password reset link to your email."
        : "Enter your email to receive a secure password reset link.";
    return (_jsx("div", { className: "min-h-screen bg-black flex items-start justify-center p-8", children: _jsx("div", { className: "w-full max-w-md", children: _jsx(AuthCard, { title: cardTitle, subtitle: cardSubtitle, children: sent ? (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "rounded-full bg-emerald-500/10 p-2", children: _jsx(CheckCircle2, { className: "h-6 w-6 text-emerald-400" }) }), _jsx("p", { className: "text-sm text-slate-400", children: "The reset link will expire in 15 minutes. Please check your inbox." })] }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3", children: [_jsxs(Button, { type: "button", variant: "outline", className: "w-full bg-transparent", onClick: goToSignIn, children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back to Sign in"] }), _jsx(Button, { type: "button", className: "w-full", onClick: () => dispatch(addToast({
                                        title: "Tip",
                                        description: "Open your email client and look for the latest message from Kizo.",
                                    })), children: "Open email app" })] })] })) : (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(InputField, { type: "email", label: "Email", placeholder: "Enter your email", value: email, onChange: handleEmailChange, error: fieldError }), _jsxs(Button, { type: "submit", variant: isFormValid ? "glow" : "default", className: "w-full", disabled: !isFormValid || sending, children: [_jsx(Mail, { className: "mr-2 h-4 w-4" }), sending ? "Sending reset link..." : "Send reset link"] }), _jsx("div", { className: "flex justify-center mt-4", children: _jsxs("button", { type: "button", onClick: goToSignIn, className: "inline-flex items-center text-slate-400 hover:text-white text-sm transition-colors", children: [_jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }), " Back to Sign in"] }) })] })) }) }) }));
}
