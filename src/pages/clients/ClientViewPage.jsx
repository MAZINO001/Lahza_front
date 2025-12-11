import { useParams } from "react-router-dom";
import Client_Sidebar from "@/components/client_components/Client_Sidebar";
import Client_Page from "@/components/client_components/Client_Page";
export default function CustomerOverview() {
  const { id } = useParams();

  return (
    <div className="flex h-screen bg-gray-50">
      <Client_Sidebar currentId={id} />
      <Client_Page currentId={id} />
    </div>
  );
}
