// TYPES.
import { Notification, NotificationType } from "@/types";

// API CALLS.
import { storeNotification } from "@/api/notifications.api";

/**
 * store a notification in the db.
 * @param sender id of user sending the notification.
 * @param receiver id of user receiving the notification.
 * @param type type of notification.
 * @returns
 */
export const sendNotification = async (
  sender: string,
  receiver: string,
  type: NotificationType,
) => {
  const payload: Notification = {
    sender,
    receiver,
    type,
  };

  return await storeNotification(payload);
};
