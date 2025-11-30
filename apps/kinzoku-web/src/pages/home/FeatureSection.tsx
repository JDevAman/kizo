import { CreditCard, Globe, Shield, Zap } from "lucide-react";
import { FeatureCard } from "../../components/Card/FeatureCard";

export const FeatureSection = () => (
  <section id="features" className="py-20 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-thin text-white mb-4">
          Why Choose KinzokuPay?
        </h2>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
          Experience the next generation of digital payments with our advanced
          features
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={Zap}
          title="Instant Transfers"
          description="Send money anywhere in the world in seconds, not days."
        />
        <FeatureCard
          icon={Shield}
          title="Bank-Level Security"
          description="Your money and data are protected with encryption and MFA."
        />
        <FeatureCard
          icon={Globe}
          title="Global Reach"
          description="Send money to 180+ countries with low fees."
        />
        <FeatureCard
          icon={CreditCard}
          title="Multiple Payment Methods"
          description="Connect bank, debit, or credit card."
        />
      </div>
    </div>
  </section>
);
