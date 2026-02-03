import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { ClientForm } from "@/Components/auth/ClientForm";

export default function ClientCreatePage() {
  const navigate = useNavigate();

  const handleClientCreated = () => {
    navigate(-1);
  };

  return (
    <ClientForm onClientCreated={handleClientCreated} isEditMode={false} />
  );
}
