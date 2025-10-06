import LeadCard, { type Lead } from "../LeadCard";

export default function LeadCardExample() {
  const sampleLead: Lead = {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.j@company.com",
    phone: "+1 (555) 123-4567",
    status: "active",
    owner: "John Smith"
  };

  return (
    <div className="p-8 max-w-sm">
      <LeadCard
        lead={sampleLead}
        onEdit={(lead) => console.log("Edit lead:", lead)}
        onDelete={(id) => console.log("Delete lead:", id)}
        onClaim={(id) => console.log("Claim lead:", id)}
      />
    </div>
  );
}
