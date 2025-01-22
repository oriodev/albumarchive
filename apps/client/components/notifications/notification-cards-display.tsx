"use client";

// COMPONENTS.

// TYPES.
import { Notification, NotificationType, User } from "@/types";
import { FriendRequestCard } from "./friend-request-card";
import { RecCard } from "./rec-card";
import { ResponseCard } from "./response-card";

export function NotificationCardsDisplay({
  notifications,
  setNotifications,
  senders,
}: {
  notifications: Notification[];
  setNotifications: (
    notifications: Notification[] | ((prev: Notification[]) => Notification[]),
  ) => void;
  senders: Record<string, User>;
}) {
  return (
    <div className="flex flex-col gap-5">
      {notifications.map((notification, index) => (
        <div key={index}>
          {notification.type === NotificationType.FRIENDREQUEST && (
            <FriendRequestCard
              notification={notification}
              setNotifications={setNotifications}
              sender={senders[notification.sender]}
            />
          )}

          {notification.type === NotificationType.ALBUMREC && (
            <RecCard
              notification={notification}
              setNotifications={setNotifications}
              sender={senders[notification.sender]}
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
