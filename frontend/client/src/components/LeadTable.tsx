import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Trash2, UserPlus, ArrowUpDown } from "lucide-react";
import StatusBadge from "./StatusBadge";
import type { Lead } from "./LeadCard";
import { useState } from "react";

interface LeadTableProps {
  leads: Lead[];
  onEdit?: (lead: Lead) => void;
  onDelete?: (id: string) => void;
  onClaim?: (id: string) => void;
}

type SortField = "name" | "email" | "status";
type SortOrder = "asc" | "desc";

export default function LeadTable({ leads, onEdit, onDelete, onClaim }: LeadTableProps) {
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortOrder === "asc" ? 1 : -1;
    return aValue > bValue ? modifier : -modifier;
  });

  return (
    <div className="rounded-md border" data-testid="table-leads">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("name")}
                className="hover-elevate -ml-3"
                data-testid="button-sort-name"
              >
                Lead
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("email")}
                className="hover-elevate -ml-3"
                data-testid="button-sort-email"
              >
                Contact
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("status")}
                className="hover-elevate -ml-3"
                data-testid="button-sort-status"
              >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedLeads.map((lead) => {
            const initials = lead.name
              .split(" ")
              .map(n => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2);

            return (
              <TableRow key={lead.id} data-testid={`row-lead-${lead.id}`} className="hover-elevate">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium" data-testid={`text-lead-name-${lead.id}`}>
                        {lead.name}
                      </div>
                      {lead.owner && (
                        <div className="text-sm text-muted-foreground">
                          Owner: {lead.owner}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-mono text-xs" data-testid={`text-lead-email-${lead.id}`}>
                      {lead.email}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground">
                      {lead.phone}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={lead.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {!lead.owner && onClaim && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onClaim(lead.id)}
                        data-testid={`button-claim-${lead.id}`}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Claim
                      </Button>
                    )}
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
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
