import { Card, CardContent } from "../../components/Card/Card";
import { Button } from "../../components/Button/Button";
import {
  Shield,
  Users,
  Globe,
  Award,
  Zap,
  Heart,
  Target,
  Eye,
} from "lucide-react";
import { useAppNavigation } from "../../utils/useAppNavigation";
import { FooterSection } from "../../components/Layout/FooterSection";

export function AboutPage() {
  const { goToSupport, goToFeatures, goToAbout } = useAppNavigation();

  const stats = [
    { label: "Active Users", value: "2M+", icon: Users },
    { label: "Countries", value: "180+", icon: Globe },
    { label: "Transactions Daily", value: "500K+", icon: Zap },
    { label: "Years of Trust", value: "8+", icon: Award },
  ];

  const values = [
    {
      icon: Shield,
      title: "Security First",
      description:
        "We prioritize security with bank-level encryption and multi-factor authentication.",
    },
    {
      icon: Heart,
      title: "Customer Obsessed",
      description:
        "Every decision is made to provide the best experience for our users.",
    },
    {
      icon: Target,
      title: "Innovation Driven",
      description: "We continuously push the boundaries of fintech innovation.",
    },
    {
      icon: Eye,
      title: "Transparency",
      description:
        "Complete transparency in fees, processes, and handling of your money.",
    },
  ];

  const team = [
    {
      name: "Alex Chen",
      role: "CEO & Co-Founder",
      bio: "Former VP at PayPal with 15+ years in fintech.",
      image: "AC",
    },
    {
      name: "Sarah Rodriguez",
      role: "CTO & Co-Founder",
      bio: "Ex-Google engineer specializing in distributed systems.",
      image: "SR",
    },
    {
      name: "Michael Johnson",
      role: "Head of Product",
      bio: "Led product teams at Stripe and Square.",
      image: "MJ",
    },
    {
      name: "Emily Watson",
      role: "Head of Security",
      bio: "Former cybersecurity consultant for major banks.",
      image: "EW",
    },
  ];

  const journey = [
    {
      year: "2016",
      title: "The Beginning",
      description: "Founded by engineers frustrated with traditional banking.",
    },
    {
      year: "2018",
      title: "Growth & Trust",
      description: "Reached first million users and expanded globally.",
    },
    {
      year: "2021",
      title: "Innovation & Scale",
      description:
        "Launched instant global transfers and AI-powered fraud detection.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl lg:text-6xl font-thin mb-6">
          Building the{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Future
          </span>{" "}
          of Finance
        </h1>
        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
          KinzokuPay was founded with a simple mission: to make financial
          transactions as seamless, secure, and accessible as possible for
          everyone, everywhere.
        </p>
        <Button variant="glow" size="lg" onClick={goToSupport}>
          Contact Us
        </Button>
      </section>

      {/* Metrics / Stats Section */}
      <section className="py-20 px-4 bg-slate-900/20">
        <h2 className="text-4xl font-thin text-center mb-4">By the Numbers</h2>
        <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
          Millions of users trust KinzokuPay for fast, secure, and reliable
          transactions every day.
        </p>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-slate-900/40 border border-slate-800 rounded-lg p-6 hover:border-cyan-500/30 transition-colors"
            >
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Journey / Story Section */}
      <section className="py-20 px-4 max-w-4xl mx-auto">
        <h2 className="text-4xl font-thin text-center mb-12">Our Journey</h2>
        <div className="space-y-12">
          {journey.map((step, i) => (
            <Card key={i} className="bg-slate-900/30 border border-slate-800">
              <CardContent className="p-8 grid lg:grid-cols-2 gap-8 items-center">
                <div className={i % 2 === 0 ? "" : "order-2 lg:order-1"}>
                  <div className="w-full h-48 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg flex items-center justify-center">
                    <Zap className="w-16 h-16 text-cyan-400" />
                  </div>
                </div>
                <div className={i % 2 === 0 ? "" : "order-1 lg:order-2"}>
                  <h3 className="text-2xl font-semibold mb-4">
                    {step.year} - {step.title}
                  </h3>
                  <p className="text-slate-400">{step.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-slate-900/20">
        <h2 className="text-4xl font-thin text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {values.map((value, i) => (
            <Card
              key={i}
              className="bg-slate-900/30 border border-slate-800 hover:border-cyan-500/30 transition-colors"
            >
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {value.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Founding Team Section */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-thin text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, i) => (
            <Card
              key={i}
              className="bg-slate-900/30 border border-slate-800 hover:border-cyan-500/30 transition-colors"
            >
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg">
                    {member.image}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-cyan-400 text-sm mb-3">{member.role}</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Optional CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-center">
        <h2 className="text-4xl font-thin mb-4">Want to Know More?</h2>
        <p className="text-xl text-slate-400 mb-8">
          Reach out to our support team for any questions about our platform.
        </p>
        <Button variant="glow" size="lg" onClick={goToSupport}>
          Contact Support
        </Button>
      </section>

      <FooterSection />
    </div>
  );
}
