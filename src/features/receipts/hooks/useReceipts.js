import { useState, useEffect } from "react";
import { toast } from "sonner";

// Mock data - replace with actual API calls
const mockReceipts = [
    {
        id: "1",
        clientName: "John Doe",
        clientEmail: "john.doe@example.com",
        clientPhone: "+1 (555) 123-4567",
        clientAddress: "123 Main St, New York, NY 10001",
        amount: 1500.00,
        taxAmount: 120.00,
        totalAmount: 1620.00,
        paymentMethod: "credit-card",
        status: "paid",
        receiptDate: "2024-01-08",
        createdAt: "2024-01-08T10:30:00Z",
        description: "Monthly subscription payment for premium services",
        notes: "Payment processed successfully. Auto-renewal enabled.",
        referenceNumber: "RCP-1704729400-123",
        items: [
            {
                id: 1,
                description: "Premium Subscription - Monthly",
                quantity: 1,
                unitPrice: 1500.00,
                total: 1500.00
            }
        ]
    },
    {
        id: "2",
        clientName: "Jane Smith",
        clientEmail: "jane.smith@example.com",
        clientPhone: "+1 (555) 987-6543",
        clientAddress: "456 Oak Ave, Los Angeles, CA 90001",
        amount: 750.00,
        taxAmount: 60.00,
        totalAmount: 810.00,
        paymentMethod: "paypal",
        status: "paid",
        receiptDate: "2024-01-07",
        createdAt: "2024-01-07T14:20:00Z",
        description: "One-time service fee",
        notes: "Consultation services for Q1 planning",
        referenceNumber: "RCP-1704643200-456",
        items: [
            {
                id: 1,
                description: "Consultation Service",
                quantity: 1,
                unitPrice: 750.00,
                total: 750.00
            }
        ]
    },
    {
        id: "3",
        clientName: "Robert Johnson",
        clientEmail: "robert.j@example.com",
        clientPhone: "+1 (555) 456-7890",
        clientAddress: "789 Pine St, Chicago, IL 60601",
        amount: 2500.00,
        taxAmount: 200.00,
        totalAmount: 2700.00,
        paymentMethod: "bank-transfer",
        status: "pending",
        receiptDate: "2024-01-06",
        createdAt: "2024-01-06T09:15:00Z",
        description: "Annual subscription payment",
        notes: "Payment pending - awaiting bank confirmation",
        referenceNumber: "RCP-1704556800-789",
        items: [
            {
                id: 1,
                description: "Enterprise Plan - Annual",
                quantity: 1,
                unitPrice: 2500.00,
                total: 2500.00
            }
        ]
    }
];

export const useReceipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch all receipts
    const fetchReceipts = async () => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));
            setReceipts(mockReceipts);
        } catch (err) {
            setError(err.message);
            toast.error("Failed to fetch receipts");
        } finally {
            setLoading(false);
        }
    };

    // Fetch single receipt
    const fetchReceipt = async (id) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));
            const receipt = mockReceipts.find(r => r.id === id);
            if (!receipt) {
                throw new Error("Receipt not found");
            }
            return receipt;
        } catch (err) {
            setError(err.message);
            toast.error("Failed to fetch receipt");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Create new receipt
    const createReceipt = async (receiptData) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            const newReceipt = {
                ...receiptData,
                id: `RCP-${Date.now()}`,
                createdAt: new Date().toISOString(),
            };

            setReceipts(prev => [newReceipt, ...prev]);
            toast.success("Receipt created successfully");
            return newReceipt;
        } catch (err) {
            setError(err.message);
            toast.error("Failed to create receipt");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Update receipt
    const updateReceipt = async (id, receiptData) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 800));

            setReceipts(prev =>
                prev.map(receipt =>
                    receipt.id === id
                        ? { ...receipt, ...receiptData, updatedAt: new Date().toISOString() }
                        : receipt
                )
            );

            toast.success("Receipt updated successfully");
            return { ...receiptData, id };
        } catch (err) {
            setError(err.message);
            toast.error("Failed to update receipt");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete receipt
    const deleteReceipt = async (id) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 500));

            setReceipts(prev => prev.filter(receipt => receipt.id !== id));
            toast.success("Receipt deleted successfully");
        } catch (err) {
            setError(err.message);
            toast.error("Failed to delete receipt");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Download receipt PDF
    const downloadReceipt = async (id) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // In a real implementation, this would generate and download a PDF
            const receipt = receipts.find(r => r.id === id);
            if (!receipt) {
                throw new Error("Receipt not found");
            }

            // Simulate download
            const link = document.createElement('a');
            link.href = '#'; // Would be actual PDF URL
            link.download = `receipt-${id}.pdf`;
            link.click();

            toast.success("Receipt downloaded successfully");
        } catch (err) {
            setError(err.message);
            toast.error("Failed to download receipt");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Send receipt via email
    const sendReceiptEmail = async (id, email) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            const receipt = receipts.find(r => r.id === id);
            if (!receipt) {
                throw new Error("Receipt not found");
            }

            toast.success(`Receipt sent to ${email}`);
        } catch (err) {
            setError(err.message);
            toast.error("Failed to send receipt");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Search receipts
    const searchReceipts = async (query) => {
        setLoading(true);
        setError(null);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 300));

            const filtered = mockReceipts.filter(receipt =>
                receipt.clientName.toLowerCase().includes(query.toLowerCase()) ||
                receipt.id.toLowerCase().includes(query.toLowerCase()) ||
                receipt.clientEmail.toLowerCase().includes(query.toLowerCase())
            );

            return filtered;
        } catch (err) {
            setError(err.message);
            toast.error("Failed to search receipts");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Get receipt statistics
    const getReceiptStats = async () => {
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 200));

            const totalReceipts = receipts.length;
            const paidReceipts = receipts.filter(r => r.status === 'paid').length;
            const pendingReceipts = receipts.filter(r => r.status === 'pending').length;
            const failedReceipts = receipts.filter(r => r.status === 'failed').length;
            const totalRevenue = receipts
                .filter(r => r.status === 'paid')
                .reduce((sum, r) => sum + (r.totalAmount || r.amount), 0);

            return {
                totalReceipts,
                paidReceipts,
                pendingReceipts,
                failedReceipts,
                totalRevenue,
                averageReceiptValue: totalReceipts > 0 ? totalRevenue / totalReceipts : 0
            };
        } catch (err) {
            setError(err.message);
            toast.error("Failed to fetch statistics");
            throw err;
        }
    };

    // Initialize data on mount
    useEffect(() => {
        fetchReceipts();
    }, []);

    return {
        data: receipts,
        loading,
        error,
        fetchReceipts,
        fetchReceipt,
        createReceipt,
        updateReceipt,
        deleteReceipt,
        downloadReceipt,
        sendReceiptEmail,
        searchReceipts,
        getReceiptStats,
    };
};
