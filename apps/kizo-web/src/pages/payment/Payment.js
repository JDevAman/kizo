import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Button, InputField, Card, CardContent, CardHeader, CardTitle, } from "@kizo/ui";
import { Send, Download, Eye, Plus } from "lucide-react";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { regex } from "../../utils/utils";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { addToast } from "@kizo/store";
import { paymentService } from "../../api/paymentService";
import { setAccount } from "@kizo/store";
import { PaiseToRupees, rupeesToPaise } from "../../utils/utils";
export function PaymentPage() {
    const { goToTransactions } = useAppNavigation();
    const dispatch = useAppDispatch();
    const balance = useAppSelector((state) => state.account.balance);
    const [activeTab, setActiveTab] = useState("transfer");
    const [loading, setLoading] = useState(false);
    const [paymentData, setPaymentData] = useState({
        recipient: "",
        amount: "",
        note: "",
    });
    const [addMoneyInput, setAddMoneyInput] = useState("");
    const parsedAddMoney = rupeesToPaise(addMoneyInput);
    const [errors, setErrors] = useState({
        recipient: "",
        amount: "",
        addMoney: "",
    });
    const sanitizeAmount = (value) => {
        let sanitized = value.replace(/[^\d.]/g, "");
        const parts = sanitized.split(".");
        if (parts.length > 2)
            sanitized = parts[0] + "." + parts[1];
        if (parts[1] && parts[1].length > 2) {
            sanitized = parts[0] + "." + parts[1].slice(0, 2);
        }
        return sanitized;
    };
    const validateAmount = (value, field) => {
        if (!value)
            setErrors((e) => ({ ...e, [field]: "Amount is required" }));
        else if (!regex.amount.test(value))
            setErrors((e) => ({
                ...e,
                [field]: "Enter a valid amount (up to 2 decimals)",
            }));
        else if (parseFloat(value) <= 0)
            setErrors((e) => ({ ...e, [field]: "Amount must be greater than 0" }));
        else
            setErrors((e) => ({ ...e, [field]: "" }));
    };
    const handleInputChange = (field, value) => {
        if (field === "recipient") {
            setPaymentData((prev) => ({ ...prev, recipient: value }));
            if (!value.trim())
                setErrors((e) => ({ ...e, recipient: "Email is required" }));
            else if (!regex.email.test(value.trim()))
                setErrors((e) => ({ ...e, recipient: "Invalid email address" }));
            else
                setErrors((e) => ({ ...e, recipient: "" }));
        }
        if (field === "amount") {
            const sanitized = sanitizeAmount(value);
            setPaymentData((prev) => ({ ...prev, amount: sanitized }));
            validateAmount(sanitized, "amount");
        }
        if (field === "note")
            setPaymentData((prev) => ({ ...prev, note: value }));
    };
    const handleAddMoneyChange = (value) => {
        const sanitized = sanitizeAmount(value);
        setAddMoneyInput(sanitized);
        if (!sanitized ||
            !regex.amount.test(sanitized) ||
            parseFloat(sanitized) <= 0) {
            setErrors((e) => ({ ...e, addMoney: "Enter a valid amount" }));
        }
        else {
            setErrors((e) => ({ ...e, addMoney: "" }));
        }
    };
    const isFormValid = !errors.recipient &&
        !errors.amount &&
        paymentData.recipient.trim() &&
        paymentData.amount.trim();
    const isAddMoneyValid = !errors.addMoney && parsedAddMoney > 0;
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            dispatch(addToast({
                title: "Invalid input",
                description: "Please fix form errors before proceeding.",
                variant: "destructive",
            }));
            return;
        }
        setLoading(true);
        try {
            const payload = {
                ...paymentData,
                amount: Math.round(rupeesToPaise(paymentData.amount)),
            };
            if (activeTab === "transfer")
                await paymentService.transferPayment(payload);
            // else await paymentService.requestPayment(payload);
            dispatch(addToast({
                title: "Payment Sent Successfully",
                description: `Money sent to ${paymentData.recipient}`,
            }));
            goToTransactions();
            setPaymentData({ recipient: "", amount: "", note: "" });
            setErrors({ recipient: "", amount: "", addMoney: "" });
        }
        catch (err) {
            dispatch(addToast({
                title: "Error",
                description: err.response?.data?.message ||
                    "Something went wrong. Try again later.",
                variant: "destructive",
            }));
        }
        finally {
            setLoading(false);
        }
    };
    const handleCheckBalance = async () => {
        setLoading(true);
        try {
            const data = await paymentService.getBalance();
            dispatch(setAccount(data));
        }
        catch {
            dispatch(addToast({
                title: "Error",
                description: "Failed to fetch balance.",
                variant: "destructive",
            }));
        }
        finally {
            setLoading(false);
        }
    };
    const handleAddMoney = async () => {
        if (!isAddMoneyValid)
            return;
        setLoading(true);
        try {
            if (activeTab === "deposit") {
                await paymentService.depositMoney(parsedAddMoney);
                dispatch(addToast({ title: "Money Added" }));
            }
            if (activeTab === "withdraw") {
                await paymentService.withdrawMoney(parsedAddMoney);
                dispatch(addToast({ title: "Withdrawal Initiated" }));
            }
            setAddMoneyInput("");
            setErrors((e) => ({ ...e, addMoney: "" }));
            await handleCheckBalance();
        }
        catch {
            dispatch(addToast({
                title: "Error",
                description: "Operation failed.",
                variant: "destructive",
            }));
        }
        finally {
            setLoading(false);
        }
    };
    const tabs = [
        { id: "transfer", label: "Send Payment", icon: Send },
        { id: "withdraw", label: "Withdraw Money", icon: Download },
        { id: "deposit", label: "Deposit Money", icon: Plus },
    ];
    const ActiveIcon = tabs.find((tab) => tab.id === activeTab)?.icon;
    return (_jsx("div", { className: "min-h-screen px-4 py-8 md:px-8 md:py-10 lg:px-12", children: _jsxs("div", { className: "max-w-7xl mx-auto space-y-8", children: [_jsxs("header", { children: [_jsx("h1", { className: "text-3xl font-light text-white mb-2", children: "Payments" }), _jsx("p", { className: "text-slate-400", children: "Send money, request payments, or add funds to your account." })] }), _jsx("div", { className: "flex flex-wrap gap-2 bg-slate-900/50 p-1 rounded-xl", children: tabs.map((tab) => (_jsxs("button", { onClick: () => setActiveTab(tab.id), className: `flex-1 min-w-[100px] flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                            ? "bg-cyan-500/20 text-cyan-400 shadow-lg"
                            : "text-slate-400 hover:text-white hover:bg-slate-800/50"}`, children: [_jsx(tab.icon, { className: "w-4 h-4" }), _jsx("span", { className: "hidden sm:inline", children: tab.label })] }, tab.id))) }), _jsxs("div", { className: "grid lg:grid-cols-3 gap-6", children: [_jsxs(Card, { className: "bg-slate-900/30 border-slate-800 lg:col-span-2 h-fit", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center text-white", children: [ActiveIcon && (_jsx(ActiveIcon, { className: "w-5 h-5 mr-2 text-cyan-400" })), tabs.find((tab) => tab.id === activeTab)?.label] }) }), _jsxs(CardContent, { className: "space-y-6", children: [activeTab === "transfer" && (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsx(InputField, { type: "email", label: "Send to", placeholder: "Enter email", value: paymentData.recipient, onChange: (e) => handleInputChange("recipient", e.target.value), error: errors.recipient, required: true }), _jsx(InputField, { type: "text", label: "Amount", placeholder: "0.00", value: paymentData.amount, onChange: (e) => handleInputChange("amount", e.target.value), error: errors.amount, required: true }), _jsx(InputField, { type: "text", label: "Note (optional)", placeholder: "What's this for?", value: paymentData.note, onChange: (e) => handleInputChange("note", e.target.value) }), _jsx(Button, { type: "submit", variant: isFormValid ? "glow" : "default", className: "w-full", disabled: !isFormValid || loading, children: loading
                                                        ? "Processing..."
                                                        : `Send ₹${paymentData.amount || "0.00"}` })] })), (activeTab === "deposit" || activeTab == "withdraw") && (_jsxs("div", { className: "space-y-6 py-4", children: [_jsx(InputField, { type: "text", label: activeTab === "deposit"
                                                        ? "Deposit Money"
                                                        : "Withdraw Money", placeholder: "0.00", value: addMoneyInput, onChange: (e) => handleAddMoneyChange(e.target.value), error: errors.addMoney }), _jsx(Button, { onClick: handleAddMoney, disabled: !isAddMoneyValid || loading, variant: isAddMoneyValid ? "glow" : "default", className: "w-full", children: loading
                                                        ? "Processing..."
                                                        : activeTab === "deposit"
                                                            ? `Add ₹${addMoneyInput ? parseFloat(addMoneyInput).toFixed(2) : "0.00"}`
                                                            : `Withdraw ₹${addMoneyInput ? parseFloat(addMoneyInput).toFixed(2) : "0.00"}` })] }))] })] }), _jsxs(Card, { className: "bg-slate-900/30 border-slate-800 lg:col-span-1 h-fit", children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "flex items-center text-white", children: [_jsx(Eye, { className: "w-5 h-5 mr-2 text-cyan-400" }), "Available Balance"] }) }), _jsxs(CardContent, { className: "flex flex-col justify-center items-center space-y-6 py-8", children: [_jsxs("p", { className: "text-5xl md:text-6xl font-thin text-cyan-400", children: ["\u20B9", balance !== null && balance !== undefined
                                                    ? PaiseToRupees(balance)
                                                    : "—"] }), _jsx(Button, { onClick: handleCheckBalance, disabled: loading, variant: "glow", className: "w-full", children: loading ? "Fetching..." : "Refresh Balance" })] })] })] })] }) }));
}
