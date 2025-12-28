import type { LucideIcon } from "lucide-react";

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
}

export function FeaturesStatsContent({ stats }: { stats: Stat[] }) {
  return (
    <section className="py-20 px-4 bg-slate-900/20">
      <h2 className="text-4xl font-thin text-center mb-12">By the Numbers</h2>

      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <div key={i}>
            <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <s.icon className="w-8 h-8 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold">{s.value}</div>
            <div className="text-slate-400">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
