import * as React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

interface StatsCardProps {
  title: string;
  value: number;
  color?: string; // Tailwind text color class
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, color = "text-white" }) => {
  return (
    <Card className="bg-slate-900/30 border-slate-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-slate-400 text-sm font-normal">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className={`text-2xl font-semibold mb-1 ${color}`}>₹{value.toFixed(2)}</div>
      </CardContent>
    </Card>
  );
};
