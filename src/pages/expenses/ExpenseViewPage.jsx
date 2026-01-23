import React from "react";
import { useParams } from "react-router-dom";
import { useExpense } from "@/features/expenses/hooks/useExpenses/useExpensesData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import {
  ArrowLeft,
  Edit,
  FileText,
  Calendar,
  DollarSign,
  CreditCard,
  User,
  Building,
  FileText as FileIcon,
} from "lucide-react";

export default function ExpenseViewPage() {
  const { id } = useParams();
  const { data: expense, isLoading } = useExpense(id);
  const navigate = useNavigate();
  const { role } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading expense...</div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Expense not found</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "reimbursed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 min-h-screen">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate(`/${role}/expenses`)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Expenses
          </Button>
        </div>

        {role === "admin" && (
          <Button
            onClick={() =>
              navigate(`/${role}/expense/${id}/edit`, {
                state: { expenseId: id },
              })
            }
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Expense
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 ">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-xl font-semibold">{expense.title}</h2>
              <Badge className={getStatusColor(expense.status)}>
                {expense.status}
              </Badge>
            </div>

            {expense.description && (
              <p className="text-gray-400 mb-4">{expense.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Date:</span>
                <span className="font-medium">
                  {new Date(expense.date).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-500">Amount:</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: expense.currency || "USD",
                  }).format(expense.amount)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm text-gray-500">Category</span>
                <p className="font-medium capitalize">
                  {expense.category || "—"}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-500">Payment Method</span>
                <p className="font-medium capitalize">
                  {expense.payment_method
                    ? expense.payment_method.replace(/_/g, " ")
                    : "—"}
                </p>
              </div>

              <div>
                <span className="text-sm text-gray-500 mr-2">Repeats</span>
                <Badge
                  variant={
                    expense.repeatedly === "none" ? "outline" : "default"
                  }
                  className="capitalize"
                >
                  {expense.repeatedly}
                </Badge>
              </div>

              <div>
                <span className="text-sm text-gray-500">Currency</span>
                <p className="font-medium">{expense.currency || "USD"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Related Items</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {expense.project_id && (
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500 mr-2">Project</span>
                    <Button
                      variant="link"
                      onClick={() =>
                        navigate(`/${role}/project/${expense.project_id}`)
                      }
                      className="p-0 h-auto font-medium"
                    >
                      View Project
                    </Button>
                  </div>
                </div>
              )}

              {expense.client_id && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500 mr-2">Client</span>
                    <Button
                      variant="link"
                      onClick={() =>
                        navigate(`/${role}/client/${expense.client_id}`)
                      }
                      className="p-0 h-auto font-medium"
                    >
                      View Client
                    </Button>
                  </div>
                </div>
              )}

              {expense.invoice_id && (
                <div className="flex items-center gap-2">
                  <FileIcon className="h-4 w-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-500 mr-2">Invoice</span>
                    <Button
                      variant="link"
                      onClick={() =>
                        navigate(`/${role}/invoice/${expense.invoice_id}`)
                      }
                      className="p-0 h-auto font-medium"
                    >
                      View Invoice
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {!expense.project_id &&
              !expense.client_id &&
              !expense.invoice_id && (
                <p className="text-gray-500">No related items</p>
              )}
          </div>
        </div>

        <div className="space-y-4">
          {expense.paid_by && (
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                Paid By
              </h3>
              <p className="font-medium">User ID: {expense.paid_by}</p>
            </div>
          )}

          {expense.attachment && (
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Attachment
              </h3>
              <Button
                variant="outline"
                onClick={() => {
                  if (typeof expense.attachment === "string") {
                    window.open(expense.attachment, "_blank");
                  }
                }}
                className="w-full"
              >
                View Attachment
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
