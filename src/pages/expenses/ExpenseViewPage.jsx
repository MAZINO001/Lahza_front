import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useExpense } from "@/features/expenses/hooks/useExpenses/useExpensesData";
import { useAuthContext } from "@/hooks/AuthContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  ArrowLeft,
  Edit,
  Calendar,
  DollarSign,
  CreditCard,
  User,
  Building,
  FileText,
  Receipt,
  Clock,
} from "lucide-react";

export default function ExpenseViewPage() {
  const { id } = useParams();
  const { data: expense, isLoading } = useExpense(id);
  const navigate = useNavigate();
  const { role } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">
          Loading expense details...
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-muted-foreground">Expense not found</div>
      </div>
    );
  }

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
      case "reimbursed":
        return "success";
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      default:
        return "outline";
    }
  };

  const formatCurrency = (amount, currency = "MAD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="p-4 min-h-screen">
      {/* Header Bar */}
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3"></div>
        {role === "admin" && (
          <Button
            onClick={() => navigate(`/${role}/expense/${id}/edit`)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Expense
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold">
                {expense.title}
              </CardTitle>
              <Badge
                variant={getStatusVariant(expense.status)}
                className="capitalize px-4 py-1 text-sm"
              >
                {expense.status}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              {expense.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {expense.description}
                </p>
              )}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-2">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(expense.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-muted p-2">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(expense.amount, expense.currency)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Category</p>
                  <p className="font-medium capitalize">
                    {expense.category || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    Payment Method
                  </p>
                  <p className="font-medium capitalize">
                    {expense.payment_method?.replace(/_/g, " ") || "—"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Repeats</p>
                  <Badge
                    variant={
                      expense.repeatedly === "none" ? "outline" : "secondary"
                    }
                    className="capitalize"
                  >
                    {expense.repeatedly}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {(expense.project || expense.client || expense.invoice) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Related To</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {expense.project && (
                  <div className="flex items-start gap-3">
                    <Building className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Project</p>
                      <Button
                        variant="link"
                        className="h-auto p-0 font-medium"
                        onClick={() =>
                          navigate(`/${role}/project/${expense.project_id}`)
                        }
                      >
                        {expense.project.name}
                      </Button>
                    </div>
                  </div>
                )}

                {expense.client && (
                  <div className="flex items-start gap-3">
                    <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Client</p>
                      <Button
                        variant="link"
                        className="h-auto p-0 font-medium"
                        onClick={() =>
                          navigate(`/${role}/client/${expense.client_id}`)
                        }
                      >
                        {expense.client.company ||
                          expense.client.name ||
                          "Client"}
                      </Button>
                    </div>
                  </div>
                )}

                {expense.invoice && (
                  <div className="flex items-start gap-3">
                    <Receipt className="mt-0.5 h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Invoice</p>
                      <Button
                        variant="link"
                        className="h-auto p-0 font-medium"
                        onClick={() =>
                          navigate(`/${role}/invoice/${expense.invoice_id}`)
                        }
                      >
                        Invoice #{expense.invoice.id} •{" "}
                        {formatCurrency(expense.invoice.total_amount)}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Metadata Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Created</p>
                <p>{new Date(expense.created_at).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Last Updated</p>
                <p>{new Date(expense.updated_at).toLocaleString()}</p>
              </div>
              {expense.paid_by && (
                <div>
                  <p className="text-muted-foreground">Paid By (User ID)</p>
                  <p className="font-medium">{expense.paid_by}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Attachment */}
          {expense.attachment && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Attachment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => window.open(expense.attachment, "_blank")}
                >
                  <FileText className="h-4 w-4" />
                  Open Receipt / File
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
