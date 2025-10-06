import { useState } from "react";
import UsernamePromptDialog from "../UsernamePromptDialog";
import { Button } from "@/components/ui/button";

export default function UsernamePromptDialogExample() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-8">
      <Button onClick={() => setOpen(true)}>
        Show Username Prompt
      </Button>
      
      <UsernamePromptDialog
        open={open}
        onSubmit={(username) => {
          console.log("Username submitted:", username);
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
      />
    </div>
  );
}
