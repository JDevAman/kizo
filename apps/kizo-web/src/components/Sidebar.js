import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { LayoutDashboard, CreditCard, History, User, ChevronLeft, ChevronRight, Zap, LogOut, ChevronUp, X, } from "lucide-react";
import { cn, Button } from "@kizo/ui";
import { useAppNavigation } from "../utils/useAppNavigation";
import { useIsMobile } from "../utils/useMobile";
import { useSelector } from "react-redux";
export function Sidebar({ mobileOpen = false, setMobileOpen, collapsed = false, setCollapsed, }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const isMobile = useIsMobile();
    const reduxUser = useSelector((state) => state.auth.user);
    const fullName = reduxUser?.firstName + " " + reduxUser?.lastName;
    const { goToDashboard, goToPayment, goToTransactions, goToProfile, logout } = useAppNavigation();
    const navigation = [
        { name: "Dashboard", onClick: goToDashboard, icon: LayoutDashboard },
        { name: "Payment", onClick: goToPayment, icon: CreditCard },
        { name: "Transactions", onClick: goToTransactions, icon: History },
        // { name: "Requests", onClick: goToRequests, icon: HandCoins },
    ];
    const handleNavClick = (onClick) => {
        if (onClick)
            onClick();
        setDropdownOpen(false);
        if (mobileOpen)
            setMobileOpen?.(false);
    };
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            const target = e.target;
            if (dropdownOpen && !target.closest("[data-dropdown]")) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [dropdownOpen]);
    const handleUserClick = () => {
        if (collapsed) {
            // Expand sidebar first, then open dropdown
            setCollapsed?.(false);
            setTimeout(() => setDropdownOpen(true), 200);
        }
        else {
            setDropdownOpen(!dropdownOpen);
        }
    };
    return (_jsxs(_Fragment, { children: [mobileOpen && (_jsx("div", { className: "fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden", onClick: () => setMobileOpen?.(false), "aria-hidden": "true" })), _jsx("aside", { className: cn("bg-slate-900/95 backdrop-blur-sm border-r border-slate-800 transition-all duration-300 flex flex-col", "lg:fixed lg:inset-y-0 lg:left-0 lg:z-30", collapsed ? "lg:w-16" : "lg:w-64", "fixed inset-y-0 left-0 z-50", "w-72 sm:w-80", mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"), children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { className: "flex items-center justify-between p-4 border-b border-slate-800 flex-shrink-0", children: [_jsxs("div", { className: cn("flex items-center space-x-2 transition-opacity duration-200", collapsed && "lg:opacity-0 lg:w-0 lg:overflow-hidden"), children: [_jsx("div", { className: "p-1.5 bg-cyan-500/10 rounded-lg", children: _jsx(Zap, { className: "w-5 h-5 text-cyan-400" }) }), _jsx("span", { className: "font-bold text-white", children: "Kizo" })] }), _jsxs("div", { className: cn("flex items-center", collapsed && !isMobile && "lg:mx-auto"), children: [!isMobile && setCollapsed && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setCollapsed(!collapsed), className: "p-1.5 hover:bg-slate-800", "aria-label": collapsed ? "Expand sidebar" : "Collapse sidebar", children: collapsed ? (_jsx(ChevronRight, { className: "w-4 h-4" })) : (_jsx(ChevronLeft, { className: "w-4 h-4" })) })), isMobile && (_jsx(Button, { variant: "ghost", size: "sm", onClick: () => setMobileOpen?.(false), className: "p-1.5 hover:bg-slate-800", "aria-label": "Close menu", children: _jsx(X, { className: "w-4 h-4" }) }))] })] }), _jsx("nav", { className: "flex-1 p-4 overflow-y-auto", "aria-label": "Main navigation", children: _jsx("ul", { className: "space-y-2", children: navigation.map((item) => (_jsx("li", { children: _jsxs("button", { onClick: () => handleNavClick(item.onClick), className: cn("w-full flex items-center px-3 py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors", collapsed
                                            ? "lg:justify-center lg:space-x-0"
                                            : "space-x-3"), "aria-label": item.name, children: [_jsx(item.icon, { className: "w-5 h-5 flex-shrink-0" }), _jsx("span", { className: cn("transition-opacity duration-200", collapsed && "lg:opacity-0 lg:w-0 lg:overflow-hidden"), children: item.name })] }) }, item.name))) }) }), _jsx("div", { className: "p-4 border-t border-slate-800 relative flex-shrink-0", "data-dropdown": true, children: _jsxs("div", { className: cn(collapsed && "lg:flex lg:flex-col lg:items-center"), children: [_jsxs("button", { onClick: handleUserClick, className: cn("flex items-center w-full rounded-lg hover:bg-slate-800 transition-colors p-2", collapsed ? "lg:justify-center lg:space-x-0" : "space-x-3"), "aria-expanded": dropdownOpen, "aria-haspopup": "true", children: [_jsx("div", { className: "w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center flex-shrink-0", children: _jsx(User, { className: "w-5 h-5 text-white" }) }), _jsxs("div", { className: cn("flex-1 min-w-0 text-left transition-opacity duration-200", collapsed && "lg:opacity-0 lg:w-0 lg:overflow-hidden"), children: [_jsx("p", { className: "text-sm font-medium text-white truncate", children: fullName ?? "Guest" }), _jsx("p", { className: "text-xs text-slate-400 truncate", children: reduxUser?.email ?? "guest@example.com" })] }), _jsx(ChevronUp, { className: cn("w-4 h-4 text-slate-400 transition-all duration-200 flex-shrink-0", dropdownOpen && "rotate-180", collapsed && "lg:opacity-0 lg:w-0 lg:overflow-hidden") })] }), dropdownOpen && (_jsx("div", { className: cn("absolute bottom-full mb-2 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 min-w-[180px]", collapsed
                                            ? "lg:left-1/2 lg:-translate-x-1/2"
                                            : "left-4 right-4"), role: "menu", children: _jsxs("div", { className: "py-2", children: [_jsxs("button", { onClick: () => handleNavClick(goToProfile), className: "flex items-center w-full px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors", role: "menuitem", children: [_jsx(User, { className: "w-4 h-4 mr-3 flex-shrink-0" }), "Profile"] }), _jsxs("button", { onClick: () => {
                                                        logout();
                                                        setDropdownOpen(false);
                                                    }, className: "flex items-center w-full px-4 py-2.5 text-sm text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-colors", role: "menuitem", children: [_jsx(LogOut, { className: "w-4 h-4 mr-3 flex-shrink-0" }), "Sign Out"] })] }) }))] }) })] }) })] }));
}
