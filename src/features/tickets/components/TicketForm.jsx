/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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
import { ArrowLeft, CheckCircle } from "lucide-react";
import FormField from "@/Components/Form/FormField";
import SelectField from "@/Components/Form/SelectField";
import TextareaField from "@/Components/Form/TextareaField";
import { useTicketsLegacy } from "../hooks/useTickets";
import { useAuthContext } from "@/hooks/AuthContext";
import { useTicket } from "../hooks/useTickets";
import FileUploader from "@/components/Form/FileUploader";
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

  const { id } = useParams();
  const { user } = useAuthContext();

  // Check if we're in edit mode
  const isEditMode = !!id;

  // Fetch ticket data if in edit mode
  const { data: ticket, isLoading: isLoadingTicket } = useTicket(id);

  // Use the real API hook
  const { createTicket, updateTicket, isCreating, isUpdating } =
    useTicketsLegacy();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_id: Number(user?.id),
      category: "",
      subcategory: "",
      subject: "",
      description: "",
      priority: "medium",
      email: "",
      attachments: [],
    },
  });

  const selectedCategory = ticketCategories.find(
    (cat) => cat.id === watch("category"),
  );

  useEffect(() => {
    if (watch("category")) {
      // Only reset subcategory in create mode or if no existing subcategory in edit mode
      if (!isEditMode || !ticket?.subcategory) {
        setValue("subcategory", "");
      }
    }
  }, [watch("category"), setValue, isEditMode, ticket?.subcategory]);

  // Populate form with ticket data when in edit mode
  useEffect(() => {
    if (isEditMode && ticket) {
      console.log("Loading ticket data:", ticket); // Debug log
      setValue("subject", ticket.title || "");
      setValue("description", ticket.description || "");
      setValue("category", ticket.category || "");
      setValue("subcategory", ticket.subcategory || "");
      setValue("priority", ticket.priority || "medium");
      setValue("user_id", ticket.user_id || user?.id);
      setTicketId(ticket.id);

      // Force form to re-render with new values
      setTimeout(() => {
        setValue("subcategory", ticket.subcategory || "");
      }, 100);
    }
  }, [isEditMode, ticket, setValue, user?.id]);

  const attachments = watch("attachments");
  console.log("Current attachments value:", attachments);

  // const onSubmit = async (data) => {
  //   try {
  //     const ticketData = {
  //       ...data,
  //       user_id: Number(user?.id),
  //     };
  //     console.log(ticketData);
  //     let response;
  //     if (isEditMode) {
  //       response = await updateTicket(id, ticketData);
  //     } else {
  //       response = await createTicket(ticketData);
  //     }

  //     setTicketId(response.id || response.ticket?.id);

  //     setIsSubmitted(true);
  //   } catch (error) {
  //     console.error("Ticket operation failed:", error);
  //   }
  // };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("user_id", Number(user?.id));
      formData.append("category", data.category);
      formData.append("subcategory", data.subcategory);
      formData.append("subject", data.subject);
      formData.append("description", data.description);
      formData.append("priority", data.priority);
      if (data.attachments instanceof FileList && data.attachments.length > 0) {
        for (let i = 0; i < data.attachments.length; i++) {
          formData.append("attachments", data.attachments[i]);
        }
      }

      console.log("FormData fields (text):", {
        user_id: data.user_id,
        category: data.category,
        subject: data.subject,
        priority: data.priority,
        // etc.
      });

      if (data.attachments?.length) {
        console.log(`Sending ${data.attachments.length} file(s)`);
        if (data.attachments instanceof FileList) {
          for (let file of data.attachments) {
            console.log("File:", file.name, file.size, file.type);
          }
        }
      } else {
        console.log("No files attached");
      }

      let response;
      if (isEditMode) {
        response = await updateTicket(id, formData);
      } else {
        response = await createTicket(formData);
      }

      setTicketId(response.id || response.ticket?.id || response.data?.id);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Ticket submit failed:", error);
    }
  };

  if (isEditMode && isLoadingTicket) {
    return (
      <div className="w-full p-4min-h-screen">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading ticket data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="w-full p-4">
        <Card className="text-center">
          <CardContent>
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isEditMode
                ? "Ticket Updated Successfully!"
                : "Ticket Created Successfully!"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isEditMode
                ? "Your support ticket has been updated and our team will review it shortly."
                : "Your support ticket has been created and our team will review it shortly."}
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
    <div className="w-full p-4 min-h-screen">
      {/* Header */}
      <div className="">
        <Button
          variant="ghost"
          onClick={() => navigate("/client/tickets")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Tickets
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="w-full flex gap-4">
              <div className="w-[50%]">
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
              <div className="w-[50%]">
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
            <div className="h-full">
              <Controller
                name="attachments"
                control={control}
                render={({ field }) => (
                  <FileUploader
                    name="Attach File"
                    label="Attach File(s) to Ticket"
                    placeholder="Add Your Attach File"
                    error={errors.attachments?.message}
                    {...field}
                  />
                )}
              />
            </div>
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
          <Button type="submit" disabled={isCreating || isUpdating}>
            {isCreating || isUpdating
              ? isEditMode
                ? "Updating Ticket..."
                : "Creating Ticket..."
              : isEditMode
                ? "Update Ticket"
                : "Create Ticket"}
          </Button>
        </div>
      </form>
    </div>
  );
}
