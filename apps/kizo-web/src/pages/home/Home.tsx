import { FooterSection } from "../../components/Layout/FooterSection";
import { CTASection } from "./CTASection";
import { TestimonialsSection } from "./TestimonialSection";
import { FeatureSection } from "./FeatureSection";
import { HeroSection } from "./HeroSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeatureSection />
      <TestimonialsSection />
      <CTASection />
      <FooterSection />
    </div>
  );
};

export default Home;
