import { Button } from "../../components/Button/Button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/Card/Card";
import { InputField } from "../../components/Form/InputField";

export const SupportContactForm = () => (
  <section className="py-20 px-4">
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-thin text-white mb-6">Still Need Help?</h2>
        <p className="text-xl text-slate-400">
          Send us a message and we'll get back to you within 24 hours
        </p>
      </div>

      <Card className="bg-slate-900/30 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white text-center">
            Contact Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <InputField type="text" label="First Name" placeholder="John" />
            <InputField type="text" label="Last Name" placeholder="Doe" />
          </div>
          <InputField
            type="email"
            label="Email"
            placeholder="john@example.com"
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>
            <select className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors">
              <option value="general">General Question</option>
              <option value="technical">Technical Issue</option>
              <option value="billing">Billing Question</option>
              <option value="feature">Feature Request</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Message
            </label>
            <textarea
              className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-colors h-32 resize-none"
              placeholder="Describe your question or issue in detail..."
            />
          </div>

          <Button variant="glow" className="w-full">
            Send Message
          </Button>
        </CardContent>
      </Card>
    </div>
  </section>
);
