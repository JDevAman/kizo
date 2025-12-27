import { FooterContent } from "@kizo/ui";
import { useAppNavigation } from "../utils/useAppNavigation";

export function FooterSection() {
  const { goToSupport } = useAppNavigation();

  return (
    <FooterContent
      links={[
        { label: "Support", onClick: goToSupport },
        { label: "About", href: "/about" },
      ]}
    />
  );
}
