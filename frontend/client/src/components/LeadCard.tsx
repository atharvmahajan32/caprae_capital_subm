import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Phone, Edit, Trash2, UserPlus } from "lucide-react";
import StatusBadge, { type LeadStatus } from "./StatusBadge";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  owner?: string;
}

interface LeadCardProps {
  lead: Lead;
  onEdit?: (lead: Lead) => void;
  onDelete?: (id: string) => void;
  onClaim?: (id: string) => void;
}

export default function LeadCard({ lead, onEdit, onDelete, onClaim }: LeadCardProps) {
  const initials = lead.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="hover-elevate" data-testid={`card-lead-${lead.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h3 className="font-semibold text-base truncate" data-testid={`text-lead-name-${lead.id}`}>
              {lead.name}
            </h3>
            {lead.owner && (
              <p className="text-sm text-muted-foreground truncate">
                Owner: {lead.owner}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={lead.status} />
      </CardHeader>
      
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4 flex-shrink-0" />
          <span className="font-mono text-xs truncate" data-testid={`text-lead-email-${lead.id}`}>
            {lead.email}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4 flex-shrink-0" />
          <span className="font-mono text-xs" data-testid={`text-lead-phone-${lead.id}`}>
            {lead.phone}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="flex gap-2 pt-2">
        {!lead.owner && onClaim && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onClaim(lead.id)}
            data-testid={`button-claim-${lead.id}`}
            className="flex-1"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Claim
          </Button>
        )}
        {/* Create sequence for this lead: navigate with query params so Sequences page can open dialog */}
        <LeadCardCreateSequenceButton leadEmail={lead.email} />

        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(lead)}
            data-testid={`button-edit-${lead.id}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(lead.id)}
            data-testid={`button-delete-${lead.id}`}
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function LeadCardCreateSequenceButton({ leadEmail }: { leadEmail: string }) {
  const [, navigate] = useLocation();

  return (
    <Button
      variant="secondary"
      size="sm"
      onClick={() => navigate(`/sequences?newSequence=1&to=${encodeURIComponent(leadEmail)}`)}
      data-testid={`button-create-sequence-${leadEmail}`}
    >
      <span className="flex items-center">
        <Mail className="h-4 w-4 mr-1" />
        Create Sequence
      </span>
    </Button>
  );
}
