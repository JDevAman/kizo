import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/Card/Card";
import { CheckCircle } from "lucide-react";

interface Status {
  service: string;
  status: "operational" | "maintenance" | "down" | "planned";
  uptime: string;
}

const systemStatus: Status[] = [
  { service: "Payment Processing", status: "operational", uptime: "99.9%" },
  { service: "Dashboard", status: "operational", uptime: "99.9%" },
  { service: "API", status: "planned", uptime: "99.8%" },
  { service: "Mobile App", status: "planned", uptime: "99.7%" },
];

export const SupportSystemStatus = () => (
  <section className="py-20 px-4 bg-slate-900/20">
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-thin text-white mb-4">System Status</h2>
        <p className="text-slate-400">Real-time status of our services</p>
      </div>
      <Card className="bg-slate-900/30 border-slate-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
            All Systems Operational
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {systemStatus.map((service, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-slate-800 last:border-b-0"
            >
              <div className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full mr-3 ${
                    service.status === "operational"
                      ? "bg-green-400"
                      : service.status === "maintenance"  
                      ? "bg-yellow-400"
                      : "bg-red-400"
                  }`}
                />
                <span className="text-white font-medium">
                  {service.service}
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-slate-400 text-sm">
                  {service.uptime} uptime
                </span>
                <span
                  className={`text-sm font-medium ${
                    service.status === "operational"
                      ? "text-green-400"
                      : service.status === "maintenance"
                      ? "text-yellow-400"
                      : "text-red-400"
                  }`}
                >
                  {service.status.charAt(0).toUpperCase() +
                    service.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </section>
);
