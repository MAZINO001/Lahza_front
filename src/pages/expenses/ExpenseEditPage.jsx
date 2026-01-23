import { useLocation, useNavigate } from "react-router-dom";
import { ExpenseForm } from "@/features/expenses/components/ExpenseForm";

export default function ExpenseEditPage() {
  const { state } = useLocation();
  const expenseId = state?.expenseId;
  const navigate = useNavigate();
  const onExpenseCreated = () => {
    navigate(-1);
  };
  return (
    <div>
      <ExpenseForm
        onExpenseCreated={onExpenseCreated}
        isEditMode={true}
        expenseId={expenseId}
      />
    </div>
  );
}
