import { AboutContent } from "@kizo/ui";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { FooterSection } from "../../components/FooterSection";

export function AboutPage() {
  const { goToSupport } = useAppNavigation();

  return (
    <>
      <AboutContent onContactClick={goToSupport} />
      <FooterSection />
    </>
  );
}
