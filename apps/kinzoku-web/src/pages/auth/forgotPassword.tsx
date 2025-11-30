import React, { useState } from "react";
import { Button } from "../../components/Button/Button";
import { InputField } from "../../components/Form/InputField";
import { AuthCard } from "../../components/Card/AuthCard";
import { Mail, CheckCircle2, ArrowLeft } from "lucide-react";
import { regex } from "../../../shared/validators";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { useAppDispatch } from "../../store/hooks";
import { addToast } from "../../store/slices/uiSlice";

export function ForgotPasswordPage() {
  const { goToSignIn } = useAppNavigation();
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const dispatch = useAppDispatch();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (!value.trim()) setFieldError("Email is required");
    else if (!regex.email.test(value.trim()))
      setFieldError("Invalid email address");
    else setFieldError("");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    if (!regex.email.test(trimmedEmail)) return;

    setSending(true);
    try {
      await new Promise((r) => setTimeout(r, 1200));
      setSent(true);
      dispatch(
        addToast({
          title: "Reset link sent",
          description: `We've emailed a secure link to ${trimmedEmail}.`,
        })
      );
    } catch {
      dispatch(
        addToast({
          title: "Something went wrong",
          description: "Please try again.",
          variant: "destructive",
        })
      );
    } finally {
      setSending(false);
    }
  };

  const isFormValid = !fieldError && email.trim().length > 0;

  const cardTitle = sent ? "Check your email" : "Forgot Password";
  const cardSubtitle = sent
    ? "We've sent a password reset link to your email."
    : "Enter your email to receive a secure password reset link.";

  return (
    <div className="min-h-screen bg-black flex items-start justify-center p-8">
      <div className="w-full max-w-md">
        <AuthCard title={cardTitle} subtitle={cardSubtitle}>
          {sent ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-500/10 p-2">
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                </div>
                <p className="text-sm text-slate-400">
                  The reset link will expire in 15 minutes. Please check your
                  inbox.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={goToSignIn}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign in
                </Button>

                <Button
                  type="button"
                  className="w-full"
                  onClick={() =>
                    dispatch(
                      addToast({
                        title: "Tip",
                        description:
                          "Open your email client and look for the latest message from KinzokuPay.",
                      })
                    )
                  }
                >
                  Open email app
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                type="email"
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
                error={fieldError}
              />

              <Button
                type="submit"
                variant={isFormValid ? "glow" : "default"}
                className="w-full"
                disabled={!isFormValid || sending}
              >
                <Mail className="mr-2 h-4 w-4" />
                {sending ? "Sending reset link..." : "Send reset link"}
              </Button>

              <div className="flex justify-center mt-4">
                <button
                  type="button"
                  onClick={goToSignIn}
                  className="inline-flex items-center text-slate-400 hover:text-white text-sm transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Sign in
                </button>
              </div>
            </form>
          )}
        </AuthCard>
      </div>
    </div>
  );
}
