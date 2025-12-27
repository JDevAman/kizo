import { Button } from "./Button";

interface CTAContentProps {
  primaryHref?: string;
  secondaryHref?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

export function CTAContent({
  primaryHref,
  secondaryHref,
  onPrimary,
  onSecondary,
}: CTAContentProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-thin text-white mb-4">
          Ready to Get Started?
        </h2>

        <p className="text-xl text-slate-400 mb-8">
          Join millions of users who trust Kizo for their financial needs
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Primary CTA */}
          {primaryHref ? (
            <a href={primaryHref}>
              <Button variant="glow" size="lg">
                Create Your Account
              </Button>
            </a>
          ) : (
            <Button variant="glow" size="lg" onClick={onPrimary}>
              Create Your Account
            </Button>
          )}

          {/* Secondary CTA */}
          {secondaryHref ? (
            <a href={secondaryHref}>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </a>
          ) : (
            <Button variant="outline" size="lg" onClick={onSecondary}>
              Learn More
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
