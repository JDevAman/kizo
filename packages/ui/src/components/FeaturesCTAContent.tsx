import { Button } from "./Button";

interface Props {
  primaryHref?: string;
  onPrimary?: () => void;
}

export function FeaturesCTAContent({ primaryHref, onPrimary }: Props) {
  return (
    <section className="py-20 px-4 text-center bg-gradient-to-r from-cyan-500/10 to-blue-500/10">
      <h2 className="text-4xl font-thin mb-4">Ready to Get Started?</h2>
      <p className="text-xl text-slate-400 mb-8">
        Experience fast, secure, global payments.
      </p>

      <Button variant="glow" size="lg">
        {primaryHref ? (
          <a href={primaryHref}>Contact Support</a>
        ) : (
          <button onClick={onPrimary}>Contact Support</button>
        )}
      </Button>
    </section>
  );
}
