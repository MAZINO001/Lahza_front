// src/pages/receipts/ReceiptViewPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuthContext } from "@/hooks/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Download,
    Edit,
    Trash2,
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
} from "lucide-react";
import { toast } from "sonner";
import { useReceipts } from "@/features/receipts/hooks/useReceipts";

const ReceiptViewPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { role } = useAuthContext();
    const { fetchReceipt, deleteReceipt, downloadReceipt, sendReceiptEmail } = useReceipts();
    const [receipt, setReceipt] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReceipt = async () => {
            try {
                const data = await fetchReceipt(id);
                setReceipt(data);
            } catch (error) {
                console.error("Error loading receipt:", error);
                toast.error("Failed to load receipt");
            } finally {
                setLoading(false);
            }
        };

        loadReceipt();
    }, [id, fetchReceipt]);

    const handleDownload = async () => {
        try {
            await downloadReceipt(id);
        } catch (error) {
            console.error("Error downloading receipt:", error);
        }
    };

    const handleEdit = () => {
        navigate(`/${role}/receipts/create?edit=${id}`);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this receipt?")) {
            try {
                await deleteReceipt(id);
                navigate(`/${role}/receipts`);
            } catch (error) {
                console.error("Error deleting receipt:", error);
            }
        }
    };

    const handleSendEmail = async () => {
        try {
            await sendReceiptEmail(id, receipt.clientEmail);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!receipt) {
        return (
            <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Receipt not found</h3>
                <p className="text-muted-foreground mb-4">
                    The receipt you're looking for doesn't exist or has been deleted.
                </p>
                <Button onClick={() => navigate(`/${role}/receipts`)}>
                    Back to Receipts
                </Button>
            </div>
        );
    }

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
            description: receipt?.clientEmail || "PayPal account"
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

    const StatusIcon = statusConfig[receipt?.status]?.icon || CheckCircle;
    const paymentMethod = paymentMethodConfig[receipt?.paymentMethod] || { label: receipt?.paymentMethod, icon: "💳", description: "" };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/${role}/receipts`)}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Receipts
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Receipt {receipt.id}</h1>
                        <p className="text-muted-foreground">
                            Payment receipt details and management
                        </p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        onClick={handleSendEmail}
                    >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Email
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleDownload}
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleEdit}
                    >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Status and Payment Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <StatusIcon className="mr-2 h-5 w-5" />
                            Payment Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-3">
                            <Badge className={statusConfig[receipt.status].color}>
                                {statusConfig[receipt.status].label}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                                Last updated: {new Date(receipt.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CreditCard className="mr-2 h-5 w-5" />
                            Payment Method
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center space-x-3">
                            <span className="text-2xl">{paymentMethod.icon}</span>
                            <div>
                                <p className="font-medium">{paymentMethod.label}</p>
                                <p className="text-sm text-muted-foreground">
                                    {paymentMethod.description}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Client Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <User className="mr-2 h-5 w-5" />
                        Client Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Name</label>
                                <p className="font-medium">{receipt.clientName}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Email</label>
                                <p className="font-medium">{receipt.clientEmail}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                                <p className="font-medium">{receipt.clientPhone}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Address</label>
                                <p className="font-medium">{receipt.clientAddress}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Receipt Date</label>
                                <p className="font-medium">{receipt.receiptDate}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Reference</label>
                                <p className="font-medium">{receipt.referenceNumber}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Receipt Items */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5" />
                        Receipt Details
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">Description</label>
                            <p className="mt-1">{receipt.description}</p>
                        </div>

                        {receipt.notes && (
                            <div>
                                <label className="text-sm font-medium text-muted-foreground">Additional Notes</label>
                                <p className="mt-1">{receipt.notes}</p>
                            </div>
                        )}

                        {/* Items Table */}
                        <div className="mt-6">
                            <h4 className="font-medium mb-3">Items</h4>
                            <div className="border rounded-lg">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b bg-muted/50">
                                            <th className="text-left p-3">Description</th>
                                            <th className="text-center p-3">Quantity</th>
                                            <th className="text-right p-3">Unit Price</th>
                                            <th className="text-right p-3">Total</th>
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
                                        <tr className="border-t">
                                            <td colSpan="3" className="p-3 text-right font-medium">Subtotal:</td>
                                            <td className="text-right p-3 font-medium">${receipt.amount.toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="3" className="p-3 text-right font-medium">Tax:</td>
                                            <td className="text-right p-3 font-medium">${receipt.taxAmount.toFixed(2)}</td>
                                        </tr>
                                        <tr className="bg-muted/50">
                                            <td colSpan="3" className="p-3 text-right font-bold">Total:</td>
                                            <td className="text-right p-3 font-bold text-lg">${receipt.totalAmount.toFixed(2)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ReceiptViewPage;
