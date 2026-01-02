import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { useState } from "react";
import { cn } from "@kizo/ui";
import { useAppSelector } from "../store/hooks";

interface LayoutProps {
  protectedPage?: boolean;
}

export function Layout({ protectedPage = false }: LayoutProps) {
  const { user } = useAppSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // 🔐 Guard protected routes
  if (protectedPage && !user) {
    return <Navigate to="/auth/signin" replace />;
  }

  // 🔐 Authenticated layout
  if (protectedPage && user) {
    return (
      <div className="min-h-screen bg-black">
        <div className="lg:hidden">
          <MobileNav onMenuClick={() => setMobileOpen(true)} />
        </div>

        <Sidebar
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />

        <main
          className={cn(
            "flex-1 min-h-screen overflow-auto transition-all duration-300",
            collapsed ? "lg:ml-16" : "lg:ml-64",
          )}
        >
          <Outlet />
        </main>
      </div>
    );
  }

  return <Outlet />;
}
