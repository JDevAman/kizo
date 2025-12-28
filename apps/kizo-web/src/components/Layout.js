import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { useState } from "react";
import { cn } from "@kizo/ui";
import { useAppSelector } from "../store/hooks";
export function Layout({ protectedPage = false }) {
    const { user } = useAppSelector((state) => state.auth);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    // 🔐 Guard protected routes
    if (protectedPage && !user) {
        return _jsx(Navigate, { to: "/auth/signin", replace: true });
    }
    // 🔐 Authenticated layout
    if (protectedPage && user) {
        return (_jsxs("div", { className: "min-h-screen bg-black", children: [_jsx("div", { className: "lg:hidden", children: _jsx(MobileNav, { onMenuClick: () => setMobileOpen(true) }) }), _jsx(Sidebar, { mobileOpen: mobileOpen, setMobileOpen: setMobileOpen, collapsed: collapsed, setCollapsed: setCollapsed }), _jsx("main", { className: cn("flex-1 min-h-screen overflow-auto transition-all duration-300", collapsed ? "lg:ml-16" : "lg:ml-64"), children: _jsx(Outlet, {}) })] }));
    }
    return _jsx(Outlet, {});
}
