import { NavbarContent } from "@kizo/ui";
import { useAppNavigation } from "../utils/useAppNavigation";

export default function Navbar() {
  const { goToSignIn, goToSignUp } = useAppNavigation();

  return (
    <NavbarContent
      items={[
        { label: "Features", href: "/features" },
        { label: "About", href: "/about" },
        { label: "Support", href: "/support" },
      ]}
      onSignIn={goToSignIn}
      onSignUp={goToSignUp}
    />
  );
}
