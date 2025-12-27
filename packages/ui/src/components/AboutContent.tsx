import { Card, CardContent, Button } from "@kizo/ui";
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

interface AboutContentProps {
  onContactClick?: () => void;
}

export function AboutContent({ onContactClick }: AboutContentProps) {
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

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl lg:text-6xl font-thin mb-6">
          Building the{" "}
          <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Future
          </span>{" "}
          of Finance
        </h1>
        <p className="text-xl text-slate-400 mb-8 leading-relaxed">
          Making financial transactions seamless, secure, and accessible.
        </p>
        {onContactClick ? (
          <Button variant="glow" size="lg" onClick={onContactClick}>
            Contact Us
          </Button>
        ) : (
          <a
            href="/support"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-6 py-3 text-white"
          >
            Contact Us
          </a>
        )}
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-slate-900/20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-slate-900/40 border border-slate-800 rounded-lg p-6"
            >
              <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-slate-900/20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {values.map((value, i) => (
            <Card key={i} className="bg-slate-900/30 border border-slate-800">
              <CardContent className="p-6 text-center">
                <value.icon className="w-6 h-6 text-cyan-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-slate-400 text-sm">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
