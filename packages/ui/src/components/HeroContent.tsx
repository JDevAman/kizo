import { Button } from "./Button";
import { PhoneMockup } from "./PhoneMockup";

interface HeroContentProps {
  primaryHref?: string;
}

export function HeroContent({ primaryHref }: HeroContentProps) {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Copy */}
        <div>
          <h1 className="text-5xl lg:text-6xl font-thin text-white mb-6">
            Join the{" "}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Future
            </span>{" "}
            of Payments
          </h1>

          <p className="text-xl text-slate-400 mb-8 leading-relaxed">
            Fast, secure, and global payments built for the modern internet.
          </p>

          <a href={primaryHref ?? "/app/auth/sign-up"}>
            <Button variant="glow" size="lg">
              Create Free Account
            </Button>
          </a>
        </div>

        {/* Visual */}
        <PhoneMockup />
      </div>
    </section>
  );
}
