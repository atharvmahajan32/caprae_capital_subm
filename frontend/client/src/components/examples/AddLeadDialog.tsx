import { useState } from "react";
import AddLeadDialog from "../AddLeadDialog";
import { Button } from "@/components/ui/button";

export default function AddLeadDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>
        Add New Lead
      </Button>
      
      <AddLeadDialog
        open={open}
        onOpenChange={setOpen}
        onSubmit={(lead) => {
          console.log("Lead submitted:", lead);
          setOpen(false);
        }}
      />
    </div>
  );
}
