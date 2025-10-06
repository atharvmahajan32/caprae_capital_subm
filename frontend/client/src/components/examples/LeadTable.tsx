import LeadTable from "../LeadTable";
import type { Lead } from "../LeadCard";

export default function LeadTableExample() {
  const sampleLeads: Lead[] = [
    {
      id: "1",
      name: "Sarah Johnson",
      email: "sarah.j@company.com",
      phone: "+1 (555) 123-4567",
      status: "active",
      owner: "John Smith"
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "m.chen@startup.io",
      phone: "+1 (555) 234-5678",
      status: "email_sent"
    },
    {
      id: "3",
      name: "Emily Rodriguez",
      email: "emily.r@business.com",
      phone: "+1 (555) 345-6789",
      status: "awaiting_reply",
      owner: "Jane Doe"
    }
  ];

  return (
    <div className="p-8">
      <LeadTable
        leads={sampleLeads}
        onEdit={(lead) => console.log("Edit:", lead)}
        onDelete={(id) => console.log("Delete:", id)}
        onClaim={(id) => console.log("Claim:", id)}
      />
    </div>
  );
}
