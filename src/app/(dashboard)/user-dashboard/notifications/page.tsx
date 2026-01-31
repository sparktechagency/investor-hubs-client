"use client";

import React, { useState } from "react";
import {
  Bell,
  Check,
  CheckCircle,
  Clock,
  Filter,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle2,
} from "lucide-react";

// Mock Data
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: "Investment Opportunity Update",
    message: "The 'Seaside Luxury Villa' project has released new financial projections.",
    time: "2 hours ago",
    read: false,
    type: "info",
  },
  {
    id: 2,
    title: "Verification Successful",
    message: "Your identity verification documents have been approved. You now have full access.",
    time: "1 day ago",
    read: false,
    type: "success",
  },
  {
    id: 3,
    title: "New Message from Broker",
    message: "John Smith has replied to your inquiry regarding the Cape Town development.",
    time: "2 days ago",
    read: true,
    type: "message",
  },
  {
    id: 4,
    title: "Subscription Renewal",
    message: "Your premium subscription will renew in 3 days. Please ensure your payment details are up to date.",
    time: "3 days ago",
    read: true,
    type: "alert",
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => !n.read);

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case "message":
        return <Bell className="w-5 h-5 text-primary" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif text-white mb-2">
            Notifications
          </h1>
          <p className="text-gray-400 text-sm sm:text-base">
            Stay updated with your latest activities and alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#111111] border border-primary/20 rounded-lg p-1 flex">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === "all"
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                filter === "unread"
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      {notifications.length > 0 && (
        <div className="flex items-center justify-between mb-6 text-sm">
          <div className="text-gray-400">
            Showing {filteredNotifications.length} notifications
          </div>
          <div className="flex gap-4">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-2 text-primary hover:text-[#E4C77D] transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span className="hidden sm:inline">Mark all read</span>
              </button>
            )}
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Clear all</span>
            </button>
          </div>
        </div>
      )}

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`
                relative group
                px-4 py-4 sm:p-5 rounded-xl border transition-all duration-200
                ${
                  notification.read
                    ? "bg-[#0D0D0D] border-gray-800"
                    : "bg-[#161616] border-primary/30"
                }
              `}
            >
              <div className="flex gap-4">
                {/* Icon */}
                <div className={`
                    mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0
                    ${notification.read ? "bg-gray-800/50" : "bg-primary/10"}
                `}>
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className={`text-sm sm:text-base font-medium ${notification.read ? "text-gray-300" : "text-white"}`}>
                      {notification.title}
                    </h3>
                    <span className="text-xs text-gray-500 shrink-0 flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {notification.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed pr-8 line-clamp-2 sm:line-clamp-none">
                    {notification.message}
                  </p>
                </div>

                {/* Hover Actions */}
                <div className="flex flex-col gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="p-1.5 hover:bg-white/10 rounded-lg text-primary transition-colors cursor-pointer"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-red-400 transition-colors cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Unread Indicator Dot (Mobile) */}
              {!notification.read && (
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-primary sm:hidden" />
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-[#111111] border border-gray-800 rounded-xl">
            <div className="w-16 h-16 bg-gray-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-8 h-8 text-gray-600" />
            </div>
            <h3 className="text-lg font-medium text-white mb-2">
              No notifications
            </h3>
            <p className="text-gray-400 max-w-xs mx-auto text-sm">
              {filter === "unread"
                ? "You have no unread notifications at the moment."
                : "It looks like you're all caught up! Check back later for updates."}
            </p>
            {filter === "unread" && (
              <button
                onClick={() => setFilter("all")}
                className="mt-6 text-primary hover:underline text-sm font-medium cursor-pointer"
              >
                View all notifications
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
