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

type Tab = "signin" | "signup";

export function AuthPage() {
  const { goToDashboard, goToSignIn, goToSignUp } = useAppNavigation();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();

  // ---------------- State  ----------------
  const [activeTab, setActiveTab] = useState<Tab>("signin");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
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
  const handleFieldChange =
    (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.trim();
      setFormData((prev) => ({ ...prev, [field]: value }));

      const update = (valid: boolean, msg = "") => {
        setFieldErrors((p) => ({ ...p, [field]: msg }));
        setFieldValid((p) => ({ ...p, [field]: valid }));
      };

      switch (field) {
        case "email":
          update(
            regex.email.test(value),
            value && !regex.email.test(value) ? "Invalid email" : "",
          );
          break;
        case "password":
          update(
            regex.password.test(value),
            value && !regex.password.test(value)
              ? "6+ chars, letters & numbers"
              : "",
          );
          break;
        case "confirmPassword":
          update(value === formData.password, "Passwords do not match");
          break;
        case "firstName":
        case "lastName":
          update(
            value.length >= 2 && value.length <= 20,
            "2–20 chars required",
          );
          break;
      }
    };

  const isFormValid = useMemo(() => {
    if (activeTab === "signin") return fieldValid.email && fieldValid.password;
    return Object.values(fieldValid).every(Boolean);
  }, [activeTab, fieldValid]);

  // ---------------- Submit  ----------------
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!isFormValid) return;

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
      } catch (err: any) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [activeTab, formData, dispatch, goToDashboard, isFormValid],
  );

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      {/* LEFT: BRAND / VALUE (40%) — FIXED & STABLE */}
      <div className="hidden lg:flex lg:w-[40%] h-screen sticky top-0 bg-[#0a0a0c] flex-col justify-center px-16 border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent" />

        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Zap className="w-3 h-3" />
            Simplifying Finance
          </div>

          <h2 className="text-4xl font-light text-white leading-tight mb-10">
            Experience the{" "}
            <span className="text-cyan-400 font-medium">next generation</span>{" "}
            of digital finance.
          </h2>

          <div className="space-y-8">
            <FeatureItem
              icon={<ShieldCheck className="w-5 h-5 text-cyan-400" />}
              title="Secure by Design"
              desc="Bank-grade security protecting your assets."
            />
            <FeatureItem
              icon={<Globe className="w-5 h-5 text-cyan-400" />}
              title="Global Access"
              desc="Operate seamlessly across borders."
            />
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 text-slate-500 text-sm">
            Trusted by <span className="text-white">10k+</span> users
          </div>
        </div>
      </div>

      {/* RIGHT: AUTH FORM (60%) — ONLY THIS SCROLLS */}
      <div className="flex-1 h-screen overflow-y-auto bg-black">
        <div className="min-h-full flex items-center justify-center p-8">
          {/* ⬇️ Increased width to reduce height */}
          <div className="w-full max-w-[520px]">
            {/* Tabs */}
            <div className="flex bg-slate-900/50 p-1 rounded-xl mb-8 border border-white/5">
              <TabButton
                tab="signin"
                activeTab={activeTab}
                onClick={() => {
                  goToSignIn();
                  setActiveTab("signin");
                }}
                label="Sign In"
                className="flex-1"
              />
              <TabButton
                tab="signup"
                activeTab={activeTab}
                onClick={() => {
                  goToSignUp();
                  setActiveTab("signup");
                }}
                label="Sign Up"
                className="flex-1"
              />
            </div>

            <AuthCard
              title={activeTab === "signin" ? "Welcome Back" : "Create Account"}
              subtitle={
                activeTab === "signin"
                  ? "Sign in to your account"
                  : "Join Kizo today"
              }
            >
              <form onSubmit={handleSubmit} className="space-y-5">
                {activeTab === "signup" && (
                  <div className="grid grid-cols-2 gap-4">
                    <InputField
                      label="First Name"
                      value={formData.firstName}
                      onChange={handleFieldChange("firstName")}
                      error={fieldErrors.firstName}
                    />
                    <InputField
                      label="Last Name"
                      value={formData.lastName}
                      onChange={handleFieldChange("lastName")}
                      error={fieldErrors.lastName}
                    />
                  </div>
                )}

                <InputField
                  type="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleFieldChange("email")}
                  error={fieldErrors.email}
                />

                <InputField
                  type="password"
                  label="Password"
                  value={formData.password}
                  onChange={handleFieldChange("password")}
                  error={fieldErrors.password}
                />

                {activeTab === "signup" && (
                  <InputField
                    type="password"
                    label="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleFieldChange("confirmPassword")}
                    error={fieldErrors.confirmPassword}
                  />
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                {/* 🔧 Button height FIXED */}
                <Button
                  type="submit"
                  variant={isFormValid ? "glow" : "default"}
                  className="w-full flex items-center justify-center gap-2"
                  disabled={!isFormValid || loading}
                >
                  {loading
                    ? "Please wait..."
                    : activeTab === "signin"
                    ? "Sign In"
                    : "Get Started"}
                  {!loading && <ArrowRight className="w-4 h-4" />}
                </Button>
              </form>
            </AuthCard>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Feature Item ----------------
function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="w-10 h-10 rounded-xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-white text-sm font-medium">{title}</h4>
        <p className="text-slate-500 text-xs">{desc}</p>
      </div>
    </div>
  );
}
