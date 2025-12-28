import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@kizo/ui";
import { Menu, Zap } from "lucide-react";
export function MobileNav({ onMenuClick }) {
    return (_jsx("div", { className: "lg:hidden bg-slate-900/95 backdrop-blur-sm border-b border-slate-800 px-4 py-3", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx("div", { className: "p-1.5 bg-cyan-500/10 rounded-lg", children: _jsx(Zap, { className: "w-5 h-5 text-cyan-400" }) }), _jsx("span", { className: "font-bold text-white", children: "Kizo" })] }), _jsxs(Button, { variant: "ghost", size: "sm", onClick: onMenuClick, className: "p-2", children: [_jsx(Menu, { className: "w-5 h-5" }), _jsx("span", { className: "sr-only", children: "Open menu" })] })] }) }));
}
