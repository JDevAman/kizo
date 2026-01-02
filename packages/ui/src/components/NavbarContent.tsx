import { Zap, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "../utils/utils";
import { Button } from "./Button";

export interface NavItem {
  label: string;
  href: string;
}

interface NavbarContentProps {
  items: NavItem[];
  showAuthButtons?: boolean;

  signInHref?: string;
  signUpHref?: string;

  onSignIn?: () => void;
  onSignUp?: () => void;

  className?: string;
}

export function NavbarContent({
  items,
  showAuthButtons = true,
  signInHref,
  signUpHref,
  onSignIn,
  onSignUp,
  className,
}: NavbarContentProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header
      className={cn(
        "w-full sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-slate-800",
        className,
      )}
    >
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-500/10 rounded-lg">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-white font-bold text-lg">kizo</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-slate-300 hover:text-white"
            >
              {item.label}
            </a>
          ))}

          {showAuthButtons && (
            <>
              {signInHref ? (
                <a href={signInHref}>
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </a>
              ) : (
                <Button variant="ghost" size="sm" onClick={onSignIn}>
                  Sign In
                </Button>
              )}

              {signUpHref ? (
                <a href={signUpHref}>
                  <Button variant="glow" size="sm">
                    Sign Up
                  </Button>
                </a>
              ) : (
                <Button variant="glow" size="sm" onClick={onSignUp}>
                  Sign Up
                </Button>
              )}
            </>
          )}
        </nav>

        {/* Mobile toggle (React only) */}
        <div className="md:hidden">
          <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-4 border-t border-slate-800">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="block text-slate-300 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
