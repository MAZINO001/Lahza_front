import React, { useState } from "react";
import { Bell, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuthContext } from "@/hooks/AuthContext";
import { Link } from "react-router-dom";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import EmptyNotifications from "@/components/empty-data-3";
export const title = "Notifications Popover";

const mockNotifications = [
  {
    id: 1,
    title: "New Project Assigned",
    description: "You have been assigned to a new project: Website Redesign",
    type: "project",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
  },
  {
    id: 2,
    title: "Task Completed",
    description: "John Doe completed the task 'Update Homepage Banner'",
    type: "task",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
  },
  {
    id: 3,
    title: "New Comment",
    description: "Sarah left a comment on your project proposal",
    type: "comment",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: 4,
    title: "Invoice Paid",
    description: "Client ABC Company paid invoice #12345",
    type: "payment",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
];

const Example = () => {
  const { role } = useAuthContext();
  const [notifications, setNotifications] = useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffInMs = now - date;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "project":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "task":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "comment":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "payment":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="relative w-10 h-10 border border-border rounded-md flex justify-center items-center"
          size="icon"
          variant="ghost"
        >
          <Bell className="h-5 w-5" />
          <Badge className="absolute -top-1 -right-1 h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Notifications</h4>
            {/* <Button onClick={clearAllNotifications} size="sm" variant="ghost">
              clear all 
            </Button> */}
            <Button onClick={markAllAsRead} size="sm" variant="ghost">
              Mark all as read
            </Button>
          </div>
          <Separator />
          <div className="h-96 overflow-auto">
            {notifications.length === 0 ? (
              <EmptyNotifications />
            ) : (
              <div className="py-2 ">
                {notifications.map((notification) => (
                  <div key={notification.id}>
                    <div className="flex items-start   gap-3 py-4  cursor-pointer hover:bg-accent/50 focus:bg-accent/50 border-none ">
                      <div className="flex-1 min-w-0 ">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4
                                className={`font-medium text-sm truncate ${
                                  !notification.read
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {notification.title}
                              </h4>
                              {!notification.read && (
                                <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                              )}
                            </div>
                            <div className="flex items-center justify-between gap-2 ">
                              <div className="flex items-center gap-2 text-xs text-muted-foreground ">
                                <Clock className="w-3 h-3" />
                                {formatTimeAgo(notification.createdAt)}
                              </div>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${getNotificationColor(notification.type)}`}
                              >
                                {notification.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {notification.id !==
                      notifications[notifications.length - 1].id && (
                      <Separator />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {notifications.length > 0 && (
          <div className="border-t pt-3 border-border bg-background flex items-center justify-center">
            <Link
              className="w-full text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 p-2 rounded-md transition-colors text-center"
              to={`/${role}/notifications`}
            >
              View all notifications
            </Link>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
export default Example;
