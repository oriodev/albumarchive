// TYPES.
import { Notification, NotificationType } from "@/types";

// API CALLS.
import { getNotifications, storeNotification } from "@/api/notifications.api";

/**
 * store a notification in the db.
 * @param sender id of user sending the notification.
 * @param receiver id of user receiving the notification.
 * @param type type of notification.
 * @returns
 */
export const sendNotification = async (payload: Notification) => {
  return await storeNotification(payload);
};

export const checkNotification = async (
  notification: Notification,
): Promise<boolean> => {
  // check if the user has already sent a rec for that album to that user

  // get all album recs for notification.reciever
  const allNotifications = await getNotifications(notification.receiver);
  const allAlbumRecs = allNotifications.filter(
    (notif: Notification) => notif.type === NotificationType.ALBUMREC,
  );

  console.log("allAlbumRecs: ", allAlbumRecs);

  const matchingAlbum = allAlbumRecs.filter(
    (rec: Notification) => rec.albumId === notification.albumId,
  );

  if (matchingAlbum.length < 1) return false;

  const matchingUser = matchingAlbum.filter(
    (rec: Notification) => rec.sender === notification.sender,
  );

  if (matchingUser < 1) return false;

  return true;
};
