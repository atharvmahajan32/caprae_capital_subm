import StatsCard from "../StatsCard";
import { Users, Mail, UserCheck, TrendingUp } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatsCard
        title="Total Leads"
        value={248}
        icon={Users}
        description="All leads in system"
        trend={{ value: 12, isPositive: true }}
      />
      <StatsCard
        title="Active Sequences"
        value={6}
        icon={Mail}
        description="Currently running"
      />
      <StatsCard
        title="Claimed Today"
        value={12}
        icon={UserCheck}
        description="By your team"
      />
      <StatsCard
        title="Response Rate"
        value="34%"
        icon={TrendingUp}
        description="Last 7 days"
        trend={{ value: 5, isPositive: true }}
      />
    </div>
  );
}
