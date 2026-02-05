// components/ContactWidget.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { MessageCircle } from "lucide-react";

export default function ContactWidget({ variant = "floating" }) {
  const [open, setOpen] = useState(false);

  const buttonContent = (
    <Button
      size={variant === "sidebar" ? "default" : "lg"}
      className={
        variant === "sidebar"
          ? "w-full justify-start gap-2 cursor-pointer"
          : "fixed bottom-6 right-6 rounded-full cursor-pointer shadow-2xl h-14 w-14 p-0 z-50 bg-primary hover:bg-primary/90 transition-all duration-300 hover:scale-110"
      }
    >
      <MessageCircle
        className={variant === "sidebar" ? "h-4 w-4" : "h-7 w-7"}
      />
      {variant === "sidebar" && <span>Contact Us</span>}
      {variant === "floating" && <span className="sr-only">Contact Us</span>}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{buttonContent}</DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Contact Us</DialogTitle>
        </DialogHeader>

        <form className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Select defaultValue="account">
              <SelectTrigger id="subject">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Account related</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="support">Technical support</SelectItem>
                <SelectItem value="feedback">Feedback</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">How can we help you?</Label>
            <Textarea
              id="message"
              placeholder="Enter your message"
              rows={5}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
