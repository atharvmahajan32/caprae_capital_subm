import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Users, Mail, UserCheck, TrendingUp, Plus, LayoutGrid, Table as TableIcon } from "lucide-react";
import StatsCard from "@/components/StatsCard";
import LeadCard, { type Lead } from "@/components/LeadCard";
import LeadTable from "@/components/LeadTable";
import AddLeadDialog from "@/components/AddLeadDialog";
import UsernamePromptDialog from "@/components/UsernamePromptDialog";
import ActivityLog, { type Activity } from "@/components/ActivityLog";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [addLeadOpen, setAddLeadOpen] = useState(false);
  const [usernamePromptOpen, setUsernamePromptOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [pendingClaimId, setPendingClaimId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>([
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
    },
    {
      id: "4",
      name: "David Kim",
      email: "david.kim@tech.com",
      phone: "+1 (555) 456-7890",
      status: "replied"
    },
    {
      id: "5",
      name: "Lisa Anderson",
      email: "l.anderson@corp.com",
      phone: "+1 (555) 567-8901",
      status: "claimed",
      owner: "John Smith"
    },
    {
      id: "6",
      name: "Robert Taylor",
      email: "rtaylor@enterprise.com",
      phone: "+1 (555) 678-9012",
      status: "active"
    }
  ]);

  const [activities, setActivities] = useState<Activity[]>([
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
    }
  ]);

  const handleAddLead = (newLead: Omit<Lead, "id">) => {
    const lead: Lead = {
      ...newLead,
      id: Date.now().toString()
    };
    setLeads([...leads, lead]);
    
    toast({
      title: "Lead added",
      description: `${lead.name} has been added successfully.`
    });

    /// backend removed for deployement
    (async () => {
      try {
        await fetch("https://httpbin.org/status/200", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: lead.name, email: lead.email })
        });
      } catch (err) {
        
      }
    })();
  };

  const handleEditLead = (lead: Lead) => {
    setEditLead(lead);
    setAddLeadOpen(true);
  };

  const handleUpdateLead = (updatedLead: Omit<Lead, "id">) => {
    if (editLead) {
      setLeads(leads.map(l => l.id === editLead.id ? { ...updatedLead, id: editLead.id } : l));
      setEditLead(null);
      
      toast({
        title: "Lead updated",
        description: `${updatedLead.name} has been updated successfully.`
      });

      // backend removed for deployement
      (async () => {
        const idNum = parseInt(editLead.id, 10);
        if (!Number.isNaN(idNum)) {
          try {
            await fetch(`https://httpbin.org/status/200/`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ name: updatedLead.name, email: updatedLead.email })
            });
          } catch (err) {
            // ignore errors to preserve current UX
          }
        }
      })();
    }
  };

  const handleDeleteLead = (id: string) => {
    const lead = leads.find(l => l.id === id);
    setLeads(leads.filter(l => l.id !== id));
    
    if (lead) {
      toast({
        title: "Lead deleted",
        description: `${lead.name} has been removed.`,
        variant: "destructive"
      });
    }

    // backend removed for deployement
    (async () => {
      const idNum = parseInt(id, 10);
      if (!Number.isNaN(idNum)) {
        try {
          await fetch(`https://httpbin.org/status/200/}`, { method: "DELETE" });
        } catch (err) {
          // ignore
        }
      }
    })();
  };

  const handleClaimLead = (id: string) => {
    setPendingClaimId(id);
    setUsernamePromptOpen(true);
  };

  const handleUsernameSubmit = (username: string) => {
    if (pendingClaimId) {
      const lead = leads.find(l => l.id === pendingClaimId);
      setLeads(leads.map(l => 
        l.id === pendingClaimId 
          ? { ...l, owner: username, status: "claimed" as const }
          : l
      ));
      
      if (lead) {
        const newActivity: Activity = {
          id: Date.now().toString(),
          action: "claimed",
          userName: username,
          leadName: lead.name,
          timestamp: "Just now"
        };
        setActivities([newActivity, ...activities]);
        
        toast({
          title: "Lead claimed",
          description: `${lead.name} has been claimed by ${username}.`
        });
      }
      
      setPendingClaimId(null);
    }
    setUsernamePromptOpen(false);

    // backend removed for deployement
    (async () => {
      if (!pendingClaimId) return;
      const idNum = parseInt(pendingClaimId, 10);
      if (Number.isNaN(idNum)) return;
      try {
        await fetch(`https://httpbin.org/status/200`, { method: "POST" });
      } catch (err) {
        // ignore
      }
    })();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Leads"
            value={leads.length}
            icon={Users}
            description="All leads in system"
          />
          <StatsCard
            title="Active Sequences"
            value={3}
            icon={Mail}
            description="Currently running"
          />
          <StatsCard
            title="Claimed Today"
            value={2}
            icon={UserCheck}
            description="By your team"
          />
          <StatsCard
            title="Response Rate"
            value="34%"
            icon={TrendingUp}
            description="Last 7 days"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Leads Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold">Leads</h2>
              <div className="flex items-center gap-2">
                <div className="flex rounded-md border">
                  <Button
                    variant={viewMode === "grid" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    data-testid="button-view-grid"
                    className="rounded-r-none"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "table" ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("table")}
                    data-testid="button-view-table"
                    className="rounded-l-none"
                  >
                    <TableIcon className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  onClick={() => {
                    setEditLead(null);
                    setAddLeadOpen(true);
                  }}
                  data-testid="button-add-lead"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lead
                </Button>
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onEdit={handleEditLead}
                    onDelete={handleDeleteLead}
                    onClaim={handleClaimLead}
                  />
                ))}
              </div>
            ) : (
              <LeadTable
                leads={leads}
                onEdit={handleEditLead}
                onDelete={handleDeleteLead}
                onClaim={handleClaimLead}
              />
            )}
          </div>

          {/* Activity Log */}
          <div className="lg:col-span-1">
            <ActivityLog activities={activities} />
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <AddLeadDialog
        open={addLeadOpen}
        onOpenChange={setAddLeadOpen}
        onSubmit={editLead ? handleUpdateLead : handleAddLead}
        editLead={editLead}
      />

      <UsernamePromptDialog
        open={usernamePromptOpen}
        onSubmit={handleUsernameSubmit}
        onCancel={() => {
          setUsernamePromptOpen(false);
          setPendingClaimId(null);
        }}
        title="Claim Lead"
        description="Enter your name to claim this lead."
      />
    </div>
  );
}
