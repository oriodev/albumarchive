"use client";

// COMPONENTS.

// TYPES.
import { Notification, NotificationType } from "@/types";
import { FriendRequestCard } from "./friend-request-card";
import { RecCard } from "./rec-card";
import { ResponseCard } from "./response-card";

export function NotificationCardsDisplay({
  notifications,
  setNotifications,
}: {
  notifications: Notification[];
  setNotifications: (
    notifications: Notification[] | ((prev: Notification[]) => Notification[]),
  ) => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      {notifications.map((notification, index) => (
        <div key={index}>
          {notification.type === NotificationType.FRIENDREQUEST && (
            <FriendRequestCard
              notification={notification}
              setNotifications={setNotifications}
            />
          )}

          {notification.type === NotificationType.ALBUMREC && (
            <RecCard
              notification={notification}
              setNotifications={setNotifications}
            />
          )}

          {notification.type === NotificationType.RESPONSE && (
            <ResponseCard
              notification={notification}
              setNotifications={setNotifications}
            />
          )}
        </div>
      ))}
    </div>
  );
}
