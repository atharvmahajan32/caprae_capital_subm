import StatusBadge from "../StatusBadge";

export default function StatusBadgeExample() {
  return (
    <div className="flex flex-wrap gap-3 p-8">
      <StatusBadge status="active" />
      <StatusBadge status="email_sent" />
      <StatusBadge status="awaiting_reply" />
      <StatusBadge status="replied" />
      <StatusBadge status="claimed" />
    </div>
  );
}
