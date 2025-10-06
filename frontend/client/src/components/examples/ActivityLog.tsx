import ActivityLog, { type Activity } from "../ActivityLog";

export default function ActivityLogExample() {
  const sampleActivities: Activity[] = [
    {
      id: "1",
      action: "claimed",
      userName: "John Smith",
      leadName: "Sarah Johnson",
      timestamp: "2 minutes ago"
    },
    {
      id: "2",
      action: "emailed",
      userName: "Jane Doe",
      leadName: "Michael Chen",
      timestamp: "15 minutes ago"
    },
    {
      id: "3",
      action: "updated",
      userName: "John Smith",
      leadName: "Emily Rodriguez",
      timestamp: "1 hour ago"
    },
    {
      id: "4",
      action: "claimed",
      userName: "Jane Doe",
      leadName: "David Kim",
      timestamp: "3 hours ago"
    },
    {
      id: "5",
      action: "deleted",
      userName: "John Smith",
      leadName: "Invalid Lead",
      timestamp: "5 hours ago"
    }
  ];

  return (
    <div className="p-8 max-w-md">
      <ActivityLog activities={sampleActivities} />
    </div>
  );
}
