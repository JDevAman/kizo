import { Outlet, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { useState } from "react";
import { cn } from "../../utils/utils";
import { useAppSelector } from "../../store/hooks";

interface LayoutProps {
  protectedPage?: boolean;
}

export function Layout({ protectedPage = false }: LayoutProps) {
  const { user, loading } = useAppSelector((state) => state.auth);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  // If route is protected but user is not logged in
  if (protectedPage && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Protected layout: sidebar + mobile nav
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
            collapsed ? "lg:ml-16" : "lg:ml-64"
          )}
        >
          <Outlet />
        </main>
      </div>
    );
  }

  // Public layout: navbar only
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
}
