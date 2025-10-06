import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, StopCircle, Mail, Clock } from "lucide-react";

export interface EmailSequence {
  id: string;
  name: string;
  emailCount: number;
  status: "active" | "paused" | "stopped";
  leadsInSequence: number;
}

interface SequenceCardProps {
  sequence: EmailSequence;
  onStart?: (id: string) => void;
  onPause?: (id: string) => void;
  onStop?: (id: string) => void;
}

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-chart-2/10 text-chart-2 border-chart-2/20",
  },
  paused: {
    label: "Paused",
    className: "bg-chart-5/10 text-chart-5 border-chart-5/20",
  },
  stopped: {
    label: "Stopped",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export default function SequenceCard({ sequence, onStart, onPause, onStop }: SequenceCardProps) {
  const config = statusConfig[sequence.status];

  return (
    <Card className="hover-elevate" data-testid={`card-sequence-${sequence.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex-1 min-w-0">
          <CardTitle className="text-base truncate" data-testid={`text-sequence-name-${sequence.id}`}>
            {sequence.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {sequence.leadsInSequence} leads enrolled
          </p>
        </div>
        <Badge variant="outline" className={config.className}>
          {config.label}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span>{sequence.emailCount} emails</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>Auto-send</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          {sequence.status === "stopped" && onStart && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onStart(sequence.id)}
              data-testid={`button-start-${sequence.id}`}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-1" />
              Start
            </Button>
          )}
          
          {sequence.status === "active" && onPause && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPause(sequence.id)}
              data-testid={`button-pause-${sequence.id}`}
              className="flex-1"
            >
              <Pause className="h-4 w-4 mr-1" />
              Pause
            </Button>
          )}
          
          {sequence.status === "paused" && onStart && (
            <Button
              variant="default"
              size="sm"
              onClick={() => onStart(sequence.id)}
              data-testid={`button-resume-${sequence.id}`}
              className="flex-1"
            >
              <Play className="h-4 w-4 mr-1" />
              Resume
            </Button>
          )}
          
          {sequence.status !== "stopped" && onStop && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStop(sequence.id)}
              data-testid={`button-stop-${sequence.id}`}
              className="flex-1"
            >
              <StopCircle className="h-4 w-4 mr-1" />
              Stop
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
