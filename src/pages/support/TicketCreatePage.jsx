/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Upload,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import { useTicketsLegacy } from "@/features/tickets/hooks/useTickets";
import { useAuthContext } from "@/hooks/AuthContext";

const ticketCategories = [
  {
    id: "website",
    title: "Website Issues",
    description: "Bugs, broken pages, UI problems, slow loading",
    icon: "🐛",
    color: "text-red-600 bg-red-50 border-red-200",
    subcategories: [
      { id: "bug", label: "Bug Report" },
      { id: "ui", label: "UI/UX Problem" },
      { id: "performance", label: "Performance Issue" },
      { id: "broken-page", label: "Broken Page" },
    ],
  },
  {
    id: "hosting",
    title: "Hosting & Server Issues",
    description: "Downtime, server errors, performance issues",
    icon: "🖥️",
    color: "text-orange-600 bg-orange-50 border-orange-200",
    subcategories: [
      { id: "downtime", label: "Service Downtime" },
      { id: "server-error", label: "Server Error" },
      { id: "slow-loading", label: "Slow Loading" },
      { id: "database", label: "Database Issue" },
    ],
  },
  {
    id: "billing",
    title: "Account & Billing Issues",
    description: "Login problems, payments, subscriptions",
    icon: "💳",
    color: "text-blue-600 bg-blue-50 border-blue-200",
    subcategories: [
      { id: "login", label: "Login Problem" },
      { id: "payment", label: "Payment Issue" },
      { id: "subscription", label: "Subscription Problem" },
      { id: "account", label: "Account Settings" },
    ],
  },
  {
    id: "general",
    title: "General Support & Feature Requests",
    description: "Questions, feedback, suggestions",
    icon: "💬",
    color: "text-green-600 bg-green-50 border-green-200",
    subcategories: [
      { id: "question", label: "General Question" },
      { id: "feedback", label: "Feedback" },
      { id: "feature-request", label: "Feature Request" },
      { id: "other", label: "Other" },
    ],
  },
];

const priorityLevels = [
  {
    id: "low",
    label: "Low - Nice to have",
    color: "bg-gray-100 text-gray-800",
  },
  {
    id: "medium",
    label: "Medium - Normal priority",
    color: "bg-orange-100 text-orange-800",
  },
  {
    id: "high",
    label: "High - Urgent issue",
    color: "bg-red-100 text-red-800",
  },
  {
    id: "urgent",
    label: "Urgent - System down",
    color: "bg-red-200 text-red-900",
  },
];

export default function TicketCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  // Use the real API hook and auth context
  const { createTicket, isCreating } = useTicketsLegacy();
  const { user } = useAuthContext();

  const [formData, setFormData] = useState({
    user_id: user?.id,
    category: searchParams.get("category") || "",
    subcategory: "",
    subject: "",
    description: "",
    priority: "medium",
    email: "",
    attachments: [],
  });

  const [errors, setErrors] = useState({});

  const selectedCategory = ticketCategories.find(
    (cat) => cat.id === formData.category
  );

  useEffect(() => {
    if (formData.category) {
      setFormData((prev) => ({ ...prev, subcategory: "" }));
    }
  }, [formData.category]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.subcategory)
      newErrors.subcategory = "Please select a subcategory";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (formData.subject.trim().length < 5)
      newErrors.subject = "Subject must be at least 5 characters";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.description.trim().length < 20)
      newErrors.description = "Description must be at least 20 characters";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      // Debug: Check if user is available
      console.log("User context:", user);
      console.log("User ID:", user?.id);

      if (!user?.id) {
        toast.error("You must be logged in to create a ticket");
        return;
      }

      // Ensure user_id is included in the payload
      const ticketData = {
        ...formData,
        user_id: user.id, // Ensure authenticated user's ID is included
      };

      // Show the payload before sending
      console.log("=== TICKET PAYLOAD BEFORE SENDING ===");
      console.log("Form data:", ticketData);
      console.log("Has attachments:", ticketData.attachments && ticketData.attachments.length > 0);
      console.log("Payload type:", ticketData.attachments?.length > 0 ? "FormData" : "JSON");

      // Use the real API to create ticket
      const response = await createTicket(ticketData);

      // Set the ticket ID from response
      setTicketId(response.id || response.ticket?.id);

      // Show success state
      setIsSubmitted(true);
    } catch (error) {
      // Error is already handled by the hook with toast
      console.error("Ticket creation failed:", error);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...files],
    }));
  };

  const removeAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Ticket Created Successfully!
            </h2>
            <p className="text-muted-foreground mb-6">
              Your support ticket has been created and our team will review it
              shortly.
            </p>
            <div className="bg-muted p-4 rounded-lg mb-6">
              <p className="text-sm text-muted-foreground mb-1">Ticket ID</p>
              <p className="text-lg font-semibold text-foreground">
                {ticketId}
              </p>
            </div>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate("/support")}>
                Back to Support Center
              </Button>
              <Button onClick={() => navigate(`/support/ticket/${ticketId}`)}>
                View Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/support")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Support Center
        </Button>
        <h1 className="text-3xl font-bold text-foreground">
          Create Support Ticket
        </h1>
        <p className="text-muted-foreground mt-2">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Select Issue Category</CardTitle>
            <CardDescription>
              Choose the category that best describes your issue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {ticketCategories.map((category) => (
                <div
                  key={category.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.category === category.id
                    ? category.color
                    : "border-border hover:border-primary/50"
                    }`}
                  onClick={() => handleInputChange("category", category.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {category.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedCategory && (
              <div>
                <Label htmlFor="subcategory">Subcategory</Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) =>
                    handleInputChange("subcategory", value)
                  }
                >
                  <SelectTrigger
                    className={`mt-1 ${errors.subcategory ? "border-destructive" : ""}`}
                  >
                    <SelectValue placeholder="Select a subcategory" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedCategory.subcategories.map((sub) => (
                      <SelectItem key={sub.id} value={sub.id}>
                        {sub.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subcategory && (
                  <p className="text-sm text-destructive mt-1">
                    {errors.subcategory}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Ticket Details */}
        <Card>
          <CardHeader>
            <CardTitle>Ticket Details</CardTitle>
            <CardDescription>
              Provide more details about your issue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Brief description of your issue"
                className={`mt-1 ${errors.subject ? "border-destructive" : ""}`}
              />
              {errors.subject && (
                <p className="text-sm text-destructive mt-1">
                  {errors.subject}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Please provide detailed information about your issue..."
                rows={6}
                className={`mt-1 ${errors.description ? "border-destructive" : ""}`}
              />
              {errors.description && (
                <p className="text-sm text-destructive mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange("priority", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((priority) => (
                    <SelectItem key={priority.id} value={priority.id}>
                      <div className="flex items-center gap-2">
                        <Badge className={priority.color}>
                          {priority.label}
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="email">Contact Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="your.email@example.com"
                className={`mt-1 ${errors.email ? "border-destructive" : ""}`}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
            <CardDescription>
              Add screenshots or files that help explain your issue (optional)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                id="attachments"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <label htmlFor="attachments" className="cursor-pointer">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Click to upload files or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, PDF, DOC up to 10MB
                </p>
              </label>
            </div>

            {formData.attachments.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Attached Files:
                </p>
                {formData.attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                  >
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        {file.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAttachment(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/support")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isCreating}>
            {isCreating ? "Creating Ticket..." : "Create Ticket"}
          </Button>
        </div>
      </form>
    </div>
  );
}
