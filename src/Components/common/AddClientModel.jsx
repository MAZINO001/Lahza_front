import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClientForm } from "@/components/auth/ClientForm";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
export default function AddClientModel() {
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>
            <Plus className="w-4 h-4" />
            Add Client
          </Button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adding Client</DialogTitle>
          </DialogHeader>

          <ClientForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
