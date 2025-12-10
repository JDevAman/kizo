import { CreditCard, Globe, Shield, Zap, BarChart2, Clock } from "lucide-react";
import { Card, CardContent } from "../../components/Card/Card";
import { Button } from "../../components/Button/Button";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { FooterSection } from "../../components/Layout/FooterSection";

export function FeaturesPage() {
  const { goToSupport } = useAppNavigation();

  const features = [
    {
      icon: Zap,
      title: "Instant Transfers",
      description: "Send money worldwide in seconds.",
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Protect your money and data with encryption & MFA.",
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Send money to 180+ countries with low fees.",
    },
    {
      icon: CreditCard,
      title: "Multiple Payment Methods",
      description: "Connect bank, debit, or credit cards.",
    },
    {
      icon: BarChart2,
      title: "Analytics & Reporting",
      description: "Real-time insights on transactions & performance.",
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Dedicated support whenever you need it.",
    },
  ];

  const stats = [
    { label: "Active Users", value: "2M+", icon: Zap },
    { label: "Transactions Daily", value: "500K+", icon: CreditCard },
    { label: "Countries Served", value: "180+", icon: Globe },
    { label: "Years of Trust", value: "8+", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl lg:text-6xl font-thin mb-6">
          Powering Seamless{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Digital Payments
          </span>
        </h1>
        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
          KinzokuPay provides a robust, secure, and global payments platform
          designed for modern businesses and individuals.
        </p>
        <Button variant="glow" size="lg" onClick={goToSupport}>
          Learn More
        </Button>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-thin text-center mb-4">
          Why Choose KinzokuPay?
        </h2>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
          Our platform combines speed, security, and global reach to deliver
          next-generation digital payments.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <Card
              key={i}
              className="bg-slate-900/30 border border-slate-800 hover:border-cyan-500/30 transition-colors"
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Metrics / Stats Section */}
      <section className="py-20 px-4 bg-slate-900/20">
        <h2 className="text-4xl font-thin text-center mb-12">By the Numbers</h2>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
          Millions of users trust KinzokuPay for their daily transactions across
          the globe.
        </p>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
        <h2 className="text-4xl font-thin mb-4">Ready to Get Started?</h2>
        <p className="text-xl text-slate-400 mb-8">
          Explore KinzokuPay and experience fast, secure, and reliable payments
          today.
        </p>
        <Button variant="glow" size="lg" onClick={goToSupport}>
          Contact Support
        </Button>
      </section>

      <FooterSection />
    </div>
  );
}
