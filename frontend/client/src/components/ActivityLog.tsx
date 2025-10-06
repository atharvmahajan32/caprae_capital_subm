import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Mail, Edit, Trash2, Clock } from "lucide-react";

export interface Activity {
  id: string;
  action: "claimed" | "emailed" | "updated" | "deleted";
  userName: string;
  leadName: string;
  timestamp: string;
}

interface ActivityLogProps {
  activities: Activity[];
}

const activityConfig = {
  claimed: {
    label: "claimed",
    icon: UserPlus,
    color: "text-chart-4",
  },
  emailed: {
    label: "claimed",
    icon: UserPlus,
    color: "text-chart-1",
  },
  updated: {
    label: "claimed",
    icon: UserPlus,
    color: "text-chart-3",
  },
  deleted: {
    label: "claimed",
    icon: UserPlus,
    color: "text-destructive",
  },
};

export default function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <Card data-testid="activity-log">
      <CardHeader>
        <CardTitle className="text-lg">Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => {
              const config = activityConfig[activity.action];
              const Icon = config.icon;
              const initials = activity.userName
                .split(" ")
                .map(n => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={activity.id}
                  className="flex gap-3 pb-4 border-l-2 border-border pl-4 ml-4 relative"
                  data-testid={`activity-${activity.id}`}
                >
                  <div className="absolute -left-[9px] top-0">
                    <div className="bg-background p-1">
                      <div className={`rounded-full bg-card p-1.5 border-2 border-border ${config.color}`}>
                        <Icon className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-7 w-7 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm">
                          <span className="font-medium">{activity.userName}</span>{" "}
                          <span className="text-muted-foreground">{config.label}</span>{" "}
                          <span className="font-medium">{activity.leadName}</span>
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          {activity.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
