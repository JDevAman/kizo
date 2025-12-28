import { Button } from "./Button";

interface Props {
  onPrimary?: () => void;
  primaryHref?: string;
}

export function FeaturesHeroContent({ onPrimary, primaryHref }: Props) {
  const ButtonWrapper = primaryHref ? "a" : "button";

  return (
    <section className="pt-32 pb-16 px-4 text-center max-w-4xl mx-auto">
      <h1 className="text-5xl lg:text-6xl font-thin mb-6">
        Powering Seamless{" "}
        <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          Digital Payments
        </span>
      </h1>

      <p className="text-xl text-slate-400 mb-8">
        Kizo provides a robust, secure, and global payments platform.
      </p>

      <Button variant="glow" size="lg">
        <ButtonWrapper
          {...(primaryHref ? { href: primaryHref } : { onClick: onPrimary })}
        >
          Learn More
        </ButtonWrapper>
      </Button>
    </section>
  );
}
