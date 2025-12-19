import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ClientForm } from "@/components/auth/ClientForm";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useAuthContext } from "@/hooks/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AddClientModel() {
  const { role } = useAuthContext();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClientCreatedByAdmin = (id) => {
    setOpen(false);
    navigate(`/${role}/client/${id}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <ClientForm handleClientCreatedByAdmin={handleClientCreatedByAdmin} />
      </DialogContent>
    </Dialog>
  );
}
