// TYPES.
import { Notification, NotificationPayload, NotificationType } from "@/types";

// API CALLS.
import { getNotifications, storeNotification } from "@/api/notifications.api";

/**
 * store a notification in the db.
 * @param sender id of user sending the notification.
 * @param receiver id of user receiving the notification.
 * @param type type of notification.
 * @returns
 */
export const sendNotification = async (payload: NotificationPayload) => {
  return await storeNotification(payload);
};

export const checkNotification = async (
  notification: NotificationPayload,
): Promise<boolean> => {
  // check if the user has already sent a rec for that album to that user

  // get all album recs for notification.reciever
  const allNotifications = await getNotifications(notification.receiver);
  const allAlbumRecs = allNotifications.filter(
    (notif: Notification) => notif.type === NotificationType.ALBUMREC,
  );

  const matchingAlbum = allAlbumRecs.filter(
    (rec: Notification) => rec.album === notification.album,
  );

  if (matchingAlbum.length < 1) return false;

  const matchingUser = matchingAlbum.filter(
    (rec: NotificationPayload) => rec.sender === notification.sender,
  );

  if (matchingUser < 1) return false;

  return true;
};
