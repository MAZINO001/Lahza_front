/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Upload,
  Paperclip,
} from "lucide-react";
import { toast } from "sonner";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import TextareaField from "@/Components/Form/TextareaField";

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
    id: "critical",
    label: "Critical - System down",
    color: "bg-red-200 text-red-900",
  },
];

export default function TicketCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      category: searchParams.get("category") || "",
      subcategory: "",
      subject: "",
      description: "",
      priority: "medium",
      email: "",
      attachments: [],
    },
  });

  const selectedCategory = ticketCategories.find(
    (cat) => cat.id === watch("category")
  );

  useEffect(() => {
    if (watch("category")) {
      setValue("subcategory", "");
    }
  }, [watch("category"), setValue]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate ticket ID
      const newTicketId = `TKT-${Date.now().toString().slice(-6)}`;
      setTicketId(newTicketId);

      // Simulate successful submission
      setIsSubmitted(true);
      toast.success("Ticket created successfully!");
    } catch (error) {
      toast.error("Failed to create ticket. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setValue("attachments", [...watch("attachments"), ...files]);
  };

  const removeAttachment = (index) => {
    setValue(
      "attachments",
      watch("attachments").filter((_, i) => i !== index)
    );
  };

  if (isSubmitted) {
    return (
      <div className="w-full p-4">
        <Card className="text-center">
          <CardContent className="p-4">
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
              <Button
                variant="outline"
                onClick={() => navigate("/client/tickets")}
              >
                Back to Tickets
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full p-4">
      {/* Header */}
      <div className="mb-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/client/tickets")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>
        <h1 className="text-3xl font-bold text-foreground">
          Create Support Ticket
        </h1>
        <p className="text-muted-foreground mt-2">
          Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    watch("category") === category.id
                      ? category.color
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setValue("category", category.id)}
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
                <Controller
                  name="subcategory"
                  control={control}
                  rules={{ required: "Please select a subcategory" }}
                  render={({ field }) => (
                    <SelectField
                      {...field}
                      label="Subcategory"
                      id="subcategory"
                      placeholder="Select a subcategory"
                      options={selectedCategory.subcategories.map((sub) => ({
                        value: sub.id,
                        label: sub.label,
                      }))}
                      error={errors.subcategory?.message}
                    />
                  )}
                />
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
              <Controller
                name="subject"
                control={control}
                rules={{
                  required: "Subject is required",
                  minLength: {
                    value: 5,
                    message: "Subject must be at least 5 characters",
                  },
                }}
                render={({ field }) => (
                  <FormField
                    {...field}
                    id="subject"
                    label="Subject"
                    type="text"
                    placeholder="Brief description of your issue"
                    error={errors.subject?.message}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="description"
                control={control}
                rules={{
                  required: "Description is required",
                  minLength: {
                    value: 20,
                    message: "Description must be at least 20 characters",
                  },
                }}
                render={({ field }) => (
                  <TextareaField
                    {...field}
                    id="description"
                    label="Description"
                    placeholder="Please provide detailed information about your issue..."
                    error={errors.description?.message}
                  />
                )}
              />
            </div>

            <div>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <SelectField
                    {...field}
                    id="priority"
                    label="Priority"
                    placeholder="Select priority level"
                    options={priorityLevels.map((priority) => ({
                      value: priority.id,
                      label: priority.label,
                    }))}
                    error={errors.priority?.message}
                  />
                )}
              />
            </div>
          </CardContent>
        </Card>

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

            {watch("attachments").length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Attached Files:
                </p>
                {watch("attachments").map((file, index) => (
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

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/client/tickets")}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Ticket..." : "Create Ticket"}
          </Button>
        </div>
      </form>
    </div>
  );
}
