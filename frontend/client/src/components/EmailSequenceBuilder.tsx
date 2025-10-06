import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Mail } from "lucide-react";

export interface EmailStep {
  id: string;
  subject: string;
  body: string;
  delayDays: number;
}

interface EmailSequenceBuilderProps {
  onSave: (steps: EmailStep[]) => void;
  initialSteps?: EmailStep[];
}

export default function EmailSequenceBuilder({ onSave, initialSteps = [] }: EmailSequenceBuilderProps) {
  const [steps, setSteps] = useState<EmailStep[]>(
    initialSteps.length > 0 ? initialSteps : [
      { id: "1", subject: "", body: "", delayDays: 0 }
    ]
  );

  const addStep = () => {
    if (steps.length < 4) {
      const newId = (Math.max(...steps.map(s => parseInt(s.id))) + 1).toString();
      setSteps([...steps, { id: newId, subject: "", body: "", delayDays: 1 }]);
    }
  };

  const removeStep = (id: string) => {
    if (steps.length > 1) {
      setSteps(steps.filter(s => s.id !== id));
    }
  };

  const updateStep = (id: string, field: keyof EmailStep, value: string | number) => {
    setSteps(steps.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSave = () => {
    onSave(steps);
  };

  return (
    <div className="space-y-4" data-testid="email-sequence-builder">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Email Sequence ({steps.length}/4)</h3>
        <Button
          onClick={addStep}
          disabled={steps.length >= 4}
          size="sm"
          data-testid="button-add-email-step"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Email
        </Button>
      </div>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card key={step.id} data-testid={`card-email-step-${step.id}`}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <Mail className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">Email {index + 1}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStep(step.id)}
                  disabled={steps.length === 1}
                  data-testid={`button-remove-step-${step.id}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {index > 0 && (
                <div>
                  <Label htmlFor={`delay-${step.id}`}>
                    Send after (days from previous email)
                  </Label>
                  <Select
                    value={step.delayDays.toString()}
                    onValueChange={(value) => updateStep(step.id, "delayDays", parseInt(value))}
                  >
                    <SelectTrigger className="mt-2" data-testid={`select-delay-${step.id}`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="2">2 days</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="5">5 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              <div>
                <Label htmlFor={`subject-${step.id}`}>Subject</Label>
                <Input
                  id={`subject-${step.id}`}
                  value={step.subject}
                  onChange={(e) => updateStep(step.id, "subject", e.target.value)}
                  placeholder="Email subject line"
                  className="mt-2"
                  data-testid={`input-subject-${step.id}`}
                />
              </div>
              
              <div>
                <Label htmlFor={`body-${step.id}`}>Message</Label>
                <Textarea
                  id={`body-${step.id}`}
                  value={step.body}
                  onChange={(e) => updateStep(step.id, "body", e.target.value)}
                  placeholder="Email body content..."
                  className="mt-2 min-h-[100px]"
                  data-testid={`textarea-body-${step.id}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSave} data-testid="button-save-sequence">
          Save Sequence
        </Button>
      </div>
    </div>
  );
}
