import { CTAContent } from "@kizo/ui";
import { useAppNavigation } from "../../utils/useAppNavigation";

export function CTASection() {
  const { goToSignUp, goToAbout } = useAppNavigation();

  return <CTAContent onPrimary={goToSignUp} onSecondary={goToAbout} />;
}
