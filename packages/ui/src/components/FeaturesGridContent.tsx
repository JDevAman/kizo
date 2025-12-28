import { Card, CardContent } from "./Card";
import type { LucideIcon } from "lucide-react";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeaturesGridContent({ features }: { features: Feature[] }) {
  return (
    <section className="py-20 px-4 max-w-7xl mx-auto">
      <h2 className="text-4xl font-thin text-center mb-4">Why Choose Kizo?</h2>
      <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
        Speed, security, and global reach.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <Card key={i} className="bg-slate-900/30 border border-slate-800">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <f.icon className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm">{f.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
