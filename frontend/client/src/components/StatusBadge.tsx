import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Mail, MessageSquare, User } from "lucide-react";

export type LeadStatus = "active" | "email_sent" | "awaiting_reply" | "replied" | "claimed";

interface StatusBadgeProps {
  status: LeadStatus;
  className?: string;
}

const statusConfig = {
  active: {
    label: "Active",
    icon: CheckCircle2,
    className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
  email_sent: {
    label: "Email Sent",
    icon: Mail,
    className: "bg-chart-1/10 text-chart-1 border-chart-1/20",
  },
  awaiting_reply: {
    label: "Awaiting Reply",
    icon: Clock,
    className: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  },
  replied: {
    label: "Replied",
    icon: MessageSquare,
    className: "bg-chart-3/10 text-chart-3 border-chart-3/20",
  },
  claimed: {
    label: "Claimed",
    icon: User,
    className: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  },
};

export default function StatusBadge({ status, className = "" }: StatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${className}`}
      data-testid={`badge-status-${status}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
