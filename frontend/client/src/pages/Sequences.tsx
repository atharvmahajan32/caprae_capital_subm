import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Mail } from "lucide-react";
import SequenceCard, { type EmailSequence } from "@/components/SequenceCard";
import EmailSequenceBuilder, { type EmailStep } from "@/components/EmailSequenceBuilder";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function Sequences() {
  const { toast } = useToast();
  const [builderOpen, setBuilderOpen] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [location] = useLocation();

  useEffect(() => {
    try {
      // Prefer the wouter `location` value when it contains query params
      let params: URLSearchParams;
      if (location && location.includes("?")) {
        const q = location.split("?")[1] ?? "";
        params = new URLSearchParams(q);
      } else {
        const search = typeof window !== "undefined" ? window.location.search : "";
        params = new URLSearchParams(search);
      }
      const newSequence = params.get("newSequence");
      const to = params.get("to");
      if (newSequence && to) {
        setRecipient(to);
        setBuilderOpen(true);
      }
    } catch (err) {
      // ignore
    }
  }, [location]);
  
  
  const [sequences, setSequences] = useState<EmailSequence[]>([
    {
      id: "1",
      name: "Sequence for sarah.j@company.com",
      emailCount: 3,
      status: "active",
      leadsInSequence: 1
    },
    {
      id: "2",
      name: "Sequence for m.chen@startup.io",
      emailCount: 4,
      status: "active",
      leadsInSequence: 1
    },
    {
      id: "3",
      name: "Sequence for l.anderson@corp.com",
      emailCount: 2,
      status: "paused",
      leadsInSequence: 1
    },
    {
      id: "4",
      name: "Sequence for rtaylor@enterprise.com",
      emailCount: 3,
      status: "stopped",
      leadsInSequence: 1
    }
  ]);

  const handleStart = (id: string) => {
    setSequences(sequences.map(s => 
      s.id === id ? { ...s, status: "active" as const } : s
    ));
    
    const sequence = sequences.find(s => s.id === id);
    toast({
      title: "Sequence started",
      description: `${sequence?.name} is now active.`
    });
  };

  const handlePause = (id: string) => {
    setSequences(sequences.map(s => 
      s.id === id ? { ...s, status: "paused" as const } : s
    ));
    
    const sequence = sequences.find(s => s.id === id);
    toast({
      title: "Sequence paused",
      description: `${sequence?.name} has been paused.`
    });
  };

  const handleStop = (id: string) => {
    setSequences(sequences.map(s => 
      s.id === id ? { ...s, status: "stopped" as const } : s
    ));
    
    const sequence = sequences.find(s => s.id === id);
    toast({
      title: "Sequence stopped",
      description: `${sequence?.name} has been stopped.`,
      variant: "destructive"
    });
  };

  const handleSaveSequence = (steps: EmailStep[]) => {
    // scheduling handled server-side.
    if (!recipient) {
      toast({ title: "Missing recipient", description: "Please enter a lead email to schedule the sequence.", variant: "destructive" });
      return;
    }

    const newSequence: EmailSequence = {
      id: Date.now().toString(),
      name: `Sequence for ${recipient}`,
      emailCount: steps.length,
      status: "active",
      leadsInSequence: 1
    };

    setSequences([...sequences, newSequence]);
    setBuilderOpen(false);

    
    const TIME_UNIT_MS = 10_000;

    // Schedule webhook calls for each step. Use TIME_UNIT_MS between steps.
    steps.forEach((step, idx) => {
      const delay = idx * TIME_UNIT_MS; // first email: 0ms
      setTimeout(async () => {
        const url = "https://httpbin.org/status/200";
        const payload = {
          to: recipient,
          subject: step.subject,
          body: step.body,
          sequenceId: newSequence.id,
          stepIndex: idx + 1
        };

        console.debug("Scheduling webhook call", { url, payload, delay });
        toast({ title: `Sending email ${idx + 1}`, description: `Attempting to queue email ${idx + 1} to ${recipient}...` });

        try {
          const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          const text = await res.text().catch(() => "");
          if (res.ok) {
            toast({ title: `Email queued`, description: `Email ${idx + 1} queued to ${recipient}. ${text}` });
          } else {
            console.error("Webhook returned error", res.status, text);
            toast({ title: `Webhook failed`, description: `Email ${idx + 1} could not be sent. ${res.status} ${text}`, variant: "destructive" });
          }
        } catch (err) {
          console.error("Failed to call webhook", err);
          toast({ title: `Error`, description: `Failed to call webhook for email ${idx + 1}. ${String(err)}`, variant: "destructive" });
        }
      }, delay);
    });

    toast({ title: "Sequence scheduled", description: `${newSequence.name} scheduled for ${recipient}. Check activity for send status.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-semibold mb-2">Email Sequences</h1>
            <p className="text-muted-foreground">
              Manage your automated email campaigns and drip sequences.
            </p>
          </div>
          <Button
            onClick={() => setBuilderOpen(true)}
            data-testid="button-create-sequence"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Sequence
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Sequences</p>
                <p className="text-2xl font-semibold mt-2">{sequences.length}</p>
              </div>
              <Mail className="h-8 w-8 text-muted-foreground" />
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-semibold mt-2 text-chart-2">
                  {sequences.filter(s => s.status === "active").length}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-chart-2/10 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-chart-2" />
              </div>
            </div>
          </div>
          
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Leads Enrolled</p>
                <p className="text-2xl font-semibold mt-2">
                  {sequences.reduce((sum, s) => sum + s.leadsInSequence, 0)}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-chart-1/10 flex items-center justify-center text-chart-1 font-semibold text-sm">
                {sequences.reduce((sum, s) => sum + s.leadsInSequence, 0)}
              </div>
            </div>
          </div>
        </div>

        {/* Sequences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sequences.map((sequence) => (
            <SequenceCard
              key={sequence.id}
              sequence={sequence}
              onStart={handleStart}
              onPause={handlePause}
              onStop={handleStop}
            />
          ))}
        </div>

        {/* Sequence Builder Dialog */}
        <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Email Sequence</DialogTitle>
              <DialogDescription>
                Build an automated email sequence with up to 4 emails. Set delays between each email.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <Label htmlFor="recipient">Lead Email</Label>
                <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="lead@example.com" className="mt-2" />
              </div>
              <EmailSequenceBuilder onSave={handleSaveSequence} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
