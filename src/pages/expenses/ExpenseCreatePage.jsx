import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { ExpenseForm } from "@/features/expenses/components/ExpenseForm";

export default function ExpenseCreatePage() {
    const navigate = useNavigate();
    const { role } = useAuthContext();

    const handleExpenseCreated = () => {
        navigate(`/${role}/expenses`);
    };

    return (
        <ExpenseForm onExpenseCreated={handleExpenseCreated} isEditMode={false} />
    );
}
