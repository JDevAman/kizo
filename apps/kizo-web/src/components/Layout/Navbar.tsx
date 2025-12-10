import { useState } from "react";
import { Link } from "react-router-dom"; // React Router
import { Zap, Menu, X } from "lucide-react";
import { cn } from "../../utils/utils";
import { Button } from "../Button/Button";
import { useAppNavigation } from "../../utils/useAppNavigation";

interface NavItem {
  text: string;
}

interface NavbarProps {
  className?: string;
  items?: NavItem[];
  showAuthButtons?: boolean;
}

const defaultNavItems: NavItem[] = [
  { text: "Features" },
  { text: "About" },
  { text: "Support" },
];

export default function Navbar({
  className = "",
  items = defaultNavItems,
  showAuthButtons = true,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { goToSignIn, goToSignUp, goToFeatures, goToAbout, goToSupport } =
    useAppNavigation();

  // Scroll to section for anchors
  const handleNavClick = (href: string) => {
    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      // use React Router navigation
      window.location.href = href; // Or use useNavigate if using React Router
    }
    setIsOpen(false); // close mobile menu
  };

  return (
    <header
      className={cn(
        "w-full sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-slate-800",
        className
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="p-1.5 bg-cyan-500/10 rounded-lg">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-white font-bold text-lg tracking-wide">
            KinzokuPay
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {items.map(({ text }, i) => (
            <button
              key={i}
              className="text-slate-300 hover:text-white transition-colors"
              onClick={() => {
                if (text === "Features") goToFeatures();
                else if (text === "About") goToAbout();
                else if (text === "Support") goToSupport();
              }}
            >
              {text}
            </button>
          ))}
          {showAuthButtons && (
            <>
              <Button variant="ghost" size="sm" onClick={goToSignIn}>
                Sign In
              </Button>
              <Button variant="glow" size="sm" onClick={goToSignUp}>
                Sign Up
              </Button>
            </>
          )}
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <nav className="md:hidden px-4 pb-4 space-y-4 border-t border-slate-800">
          {items.map(({ text, href }, i) => (
            <button
              key={i}
              onClick={() => handleNavClick(href)}
              className="block text-slate-300 hover:text-white transition-colors w-full text-left"
            >
              {text}
            </button>
          ))}
          {showAuthButtons && (
            <>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-left"
                onClick={goToSignIn}
              >
                Sign In
              </Button>
              <Button
                variant="glow"
                size="sm"
                className="w-full text-left"
                onClick={goToSignUp}
              >
                Sign Up
              </Button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
