import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  Trash2,
  Clock,
  CheckCheck,
  Briefcase,
  CheckSquare,
  MessageCircle,
  DollarSign,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthContext } from "@/hooks/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { requestNotificationPermission } from "@/features/notifications/hooks/requestPermission";

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

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { user, role } = useAuthContext();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    // TODO: Add navigation logic based on notification type
    console.log("Notification clicked:", notification);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button
            size="icon"
            className="relative h-10 w-10 hover:bg-gray-100 rounded-md flex items-center justify-center"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 hover:bg-red-600">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-100 p-0 bg-background border-border shadow-lg"
          sideOffset={8}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs h-8 px-2"
                >
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Mark all read
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAllNotifications}
                  className="text-xs h-8 px-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear all
                </Button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <ScrollArea className="h-96">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mb-3" />
                <h4 className="font-medium text-foreground mb-1">
                  No notifications
                </h4>
                <p className="text-sm text-muted-foreground">
                  You're all caught up! Check back later for updates.
                </p>
              </div>
            ) : (
              <div className="py-2">
                {notifications.map((notification) => (
                  <div key={notification.id}>
                    <DropdownMenuItem
                      className="flex items-start gap-3 p-4 cursor-pointer hover:bg-accent/50 focus:bg-accent/50 border-none"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex-1 min-w-0">
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
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                              {notification.description}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
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

                          <div className="flex items-center gap-1 shrink-0">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-accent"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:bg-accent text-red-600 hover:text-red-700"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    {notification.id !==
                      notifications[notifications.length - 1].id && (
                      <Separator className="mx-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>

          {notifications.length > 0 && (
            <div className="border-t p-3 border-border bg-background flex items-center justify-center">
              <Link
                className="w-full text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 p-2 rounded-md transition-colors text-center"
                to={`/${role}/notifications`}
              >
                View all notifications
              </Link>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
