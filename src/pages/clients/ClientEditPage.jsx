import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { ClientForm } from "@/Components/auth/ClientForm";

export default function ClientEditPage() {
  const navigate = useNavigate();
  const { role } = useAuthContext();

  const handleClientUpdated = () => {
    navigate(`/${role}/clients`);
  };

  return <ClientForm onClientUpdated={handleClientUpdated} isEditMode={true} />;
}
