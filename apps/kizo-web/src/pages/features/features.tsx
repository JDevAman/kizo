import {
  FeaturesHeroContent,
  FeaturesGridContent,
  FeaturesStatsContent,
  FeaturesCTAContent,
} from "@kizo/ui";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { FooterSection } from "../../components/FooterSection";
import { CreditCard, Globe, Shield, Zap, BarChart2, Clock } from "lucide-react";

export function FeaturesPage() {
  const { goToSupport } = useAppNavigation();

  return (
    <div className="min-h-screen bg-black text-white">
      <FeaturesHeroContent onPrimary={goToSupport} />

      <FeaturesGridContent
        features={[
          {
            icon: Zap,
            title: "Instant Transfers",
            description: "Send money worldwide in seconds.",
          },
          {
            icon: Shield,
            title: "Security",
            description: "Bank-grade encryption & MFA.",
          },
          {
            icon: Globe,
            title: "Global Reach",
            description: "180+ countries supported.",
          },
          {
            icon: CreditCard,
            title: "Payments",
            description: "Cards, banks & more.",
          },
          {
            icon: BarChart2,
            title: "Analytics",
            description: "Real-time insights.",
          },
          {
            icon: Clock,
            title: "24/7 Support",
            description: "Always available.",
          },
        ]}
      />

      <FeaturesStatsContent
        stats={[
          { icon: Zap, label: "Active Users", value: "2M+" },
          { icon: CreditCard, label: "Transactions Daily", value: "500K+" },
          { icon: Globe, label: "Countries", value: "180+" },
          { icon: Shield, label: "Years of Trust", value: "8+" },
        ]}
      />

      <FeaturesCTAContent onPrimary={goToSupport} />
      <FooterSection />
    </div>
  );
}
