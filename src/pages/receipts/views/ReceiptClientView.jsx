import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  DollarSign,
  Calendar,
  User,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Building,
} from "lucide-react";

const mockReceipt = {
  id: "RCP-001",
  clientName: "John Doe",
  clientEmail: "john.doe@example.com",
  clientPhone: "+1 (555) 123-4567",
  clientAddress: "123 Main St, New York, NY 10001",
  amount: 1500.00,
  paymentMethod: "credit-card",
  status: "paid",
  receiptDate: "2024-01-08",
  createdAt: "2024-01-08T10:30:00Z",
  description: "Monthly subscription payment for premium services",
  notes: "Payment processed successfully. Auto-renewal enabled.",
  referenceNumber: "RCP-1704729400-123",
  taxAmount: 120.00,
  totalAmount: 1620.00,
  items: [
    {
      id: 1,
      description: "Premium Subscription - Monthly",
      quantity: 1,
      unitPrice: 1500.00,
      total: 1500.00
    }
  ],
  companyInfo: {
    name: "Your Company Name",
    address: "456 Business Ave, Suite 100, New York, NY 10002",
    phone: "+1 (555) 987-6543",
    email: "billing@yourcompany.com",
    website: "www.yourcompany.com"
  }
};

const statusConfig = {
  paid: {
    label: "Paid",
    color: "bg-green-100 text-green-800",
    icon: CheckCircle
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-100 text-yellow-800",
    icon: Clock
  },
  failed: {
    label: "Failed",
    color: "bg-red-100 text-red-800",
    icon: XCircle
  }
};

const paymentMethodConfig = {
  "credit-card": {
    label: "Credit Card",
    icon: "💳",
    description: "Visa ending in 4242"
  },
  "paypal": {
    label: "PayPal",
    icon: "🅿️",
    description: "john.doe@example.com"
  },
  "bank-transfer": {
    label: "Bank Transfer",
    icon: "🏦",
    description: "Account ending in 7890"
  },
  "cash": {
    label: "Cash",
    icon: "💵",
    description: "In-person payment"
  }
};

const ReceiptClientView = () => {
  const { id } = useParams();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Load receipt data from API
    const loadReceipt = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setReceipt(mockReceipt);
      } catch (error) {
        console.error("Error loading receipt:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReceipt();
  }, [id]);

  const handleDownload = () => {
    // TODO: Implement PDF download
    window.print();
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!receipt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Receipt not found</h3>
          <p className="text-muted-foreground">
            The receipt you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  const StatusIcon = statusConfig[receipt.status].icon;
  const paymentMethod = paymentMethodConfig[receipt.paymentMethod];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Print Header */}
        <div className="mb-6 print:hidden">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Receipt</h1>
              <p className="text-gray-600">Receipt #{receipt.id}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handlePrint}
              >
                Print
              </Button>
              <Button
                onClick={handleDownload}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Main Receipt Card */}
        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Header */}
            <div className="border-b pb-6 mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">PAYMENT RECEIPT</h2>
                  <p className="text-gray-600">Thank you for your payment</p>
                </div>
                <div className="text-right">
                  <Badge className={statusConfig[receipt.status].color}>
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {statusConfig[receipt.status].label}
                  </Badge>
                  <p className="text-sm text-gray-500 mt-1">
                    {receipt.receiptDate}
                  </p>
                </div>
              </div>
            </div>

            {/* Company and Client Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              {/* Company Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Building className="mr-2 h-4 w-4" />
                  From
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{receipt.companyInfo.name}</p>
                  <p className="text-gray-600">{receipt.companyInfo.address}</p>
                  <p className="text-gray-600">{receipt.companyInfo.phone}</p>
                  <p className="text-gray-600">{receipt.companyInfo.email}</p>
                  <p className="text-gray-600">{receipt.companyInfo.website}</p>
                </div>
              </div>

              {/* Client Info */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  To
                </h3>
                <div className="space-y-1 text-sm">
                  <p className="font-medium">{receipt.clientName}</p>
                  <p className="text-gray-600">{receipt.clientAddress}</p>
                  <p className="text-gray-600">{receipt.clientPhone}</p>
                  <p className="text-gray-600">{receipt.clientEmail}</p>
                </div>
              </div>
            </div>

            {/* Receipt Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Receipt Number</p>
                <p className="font-semibold">{receipt.referenceNumber}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                <div className="flex items-center">
                  <span className="mr-2">{paymentMethod.icon}</span>
                  <span className="font-semibold">{paymentMethod.label}</span>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Payment Date</p>
                <p className="font-semibold">{receipt.receiptDate}</p>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Payment Details</h3>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="text-left p-3 font-medium text-gray-700">Description</th>
                      <th className="text-center p-3 font-medium text-gray-700">Quantity</th>
                      <th className="text-right p-3 font-medium text-gray-700">Unit Price</th>
                      <th className="text-right p-3 font-medium text-gray-700">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receipt.items.map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-3">{item.description}</td>
                        <td className="text-center p-3">{item.quantity}</td>
                        <td className="text-right p-3">${item.unitPrice.toFixed(2)}</td>
                        <td className="text-right p-3">${item.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-gray-50">
                      <td colSpan="3" className="p-3 text-right font-medium">Subtotal:</td>
                      <td className="text-right p-3 font-medium">${receipt.amount.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td colSpan="3" className="p-3 text-right font-medium">Tax:</td>
                      <td className="text-right p-3 font-medium">${receipt.taxAmount.toFixed(2)}</td>
                    </tr>
                    <tr className="bg-primary text-primary-foreground">
                      <td colSpan="3" className="p-4 text-right font-bold">Total Paid:</td>
                      <td className="text-right p-4 font-bold text-lg">${receipt.totalAmount.toFixed(2)}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Description and Notes */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{receipt.description}</p>
              
              {receipt.notes && (
                <>
                  <h3 className="font-semibold text-gray-900 mb-2 mt-4">Additional Notes</h3>
                  <p className="text-gray-700">{receipt.notes}</p>
                </>
              )}
            </div>

            {/* Footer */}
            <div className="border-t pt-6 text-center text-sm text-gray-600">
              <p>This is a computer-generated receipt and does not require a signature.</p>
              <p className="mt-1">For any questions, please contact us at {receipt.companyInfo.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Print Actions */}
        <div className="mt-6 text-center print:hidden">
          <p className="text-gray-600 mb-4">Need help? Contact our support team</p>
          <Button variant="outline" onClick={handlePrint}>
            Print This Receipt
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReceiptClientView;
