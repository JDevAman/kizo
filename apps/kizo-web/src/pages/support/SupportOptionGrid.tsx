import { Card, CardContent } from "../../components/Card/Card";
import { Button } from "../../components/Button/Button";
import { Clock } from "lucide-react";
import { SupportOption } from "../../utils/types";

export const SupportOptionGrid = ({
  options,
}: {
  options: SupportOption[];
}) => {
  return (
    <section className="py-20 px-4 bg-slate-900/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-thin text-white mb-6">Get in Touch</h2>
          <p className="text-xl text-slate-400">
            Choose the support option that works best for you
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {options.map((option, index) => (
            <Card
              key={index}
              className="bg-slate-900/30 border-slate-800 hover:border-cyan-500/30 transition-colors"
            >
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <option.icon className={`w-8 h-8 ${option.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {option.title}
                </h3>
                <p className="text-slate-400 mb-4 leading-relaxed">
                  {option.description}
                </p>
                <div className="flex items-center justify-center text-slate-500 text-sm mb-6">
                  <Clock className="w-4 h-4 mr-2" />
                  {option.availability}
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  {option.action}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
