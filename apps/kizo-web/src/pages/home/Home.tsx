import { FooterSection } from "../../components/FooterSection";
import { CTASection } from "./CTASection";
import { TestimonialContent } from "@kizo/ui";
import { FeatureContent } from "@kizo/ui";
import { HeroSection } from "./HeroSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeatureContent />
      <TestimonialContent />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default Home;
