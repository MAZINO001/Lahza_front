import { HelpCircle } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export const title = "Confirmation with Centered Icon";

const AlertDialogConfirmation = ({
  triggerButton,
  title = "Enable Notifications?",
  description = "Stay up to date with important updates and messages from your team.",
  icon = HelpCircle,
  iconBgColor = "bg-blue-100 dark:bg-blue-900",
  iconColor = "text-blue-600 dark:text-blue-400",
  cancelText = "Not Now",
  actionText = "Enable",
  onAction
}) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      {triggerButton}
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader className="items-center">
        <div className={`flex size-12 items-center justify-center rounded-full ${iconBgColor}`}>
          <icon className={`size-6 ${iconColor}`} />
        </div>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription className="text-center">
          {description}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{cancelText}</AlertDialogCancel>
        <AlertDialogAction onClick={onAction}>{actionText}</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default AlertDialogConfirmation;
