// TYPES.
import { Notification, NotificationPayload, NotificationType } from "@/types";

// API CALLS.
import { getNotifications, storeNotification } from "@/api/notifications.api";
import { Socket } from "socket.io-client";

/**
 * send notification (websocket + store in db).
 * @param sender id of user sending the notification.
 * @param receiver id of user receiving the notification.
 * @param type type of notification.
 * @returns
 */
export const sendNotification = async (
  socket: Socket | null,
  payload: NotificationPayload,
) => {
  if (!socket) {
    console.log("no socket");
    return;
  }

  socket.emit("newNotification", payload);

  return await storeNotification(payload);
};

/**
 * check if the user already has an album rec for that album from that user
 * @param notification
 * @returns
 */
export const checkNotification = async (
  notification: NotificationPayload,
): Promise<boolean> => {
  // check if the user has already sent a rec for that album to that user

  // get all album recs for notification.reciever
  if (!notification.receiver) return false;

  const allNotifications = await getNotifications(notification.receiver);
  const allAlbumRecs = allNotifications.filter(
    (notif: Notification) => notif.type === NotificationType.ALBUMREC,
  );

  const matchingAlbum = allAlbumRecs.filter(
    (rec: Notification) => rec.album?._id === notification.album,
  );

  if (matchingAlbum.length < 1) return false;

  const matchingUser = matchingAlbum.filter(
    (rec: NotificationPayload) => rec.sender === notification.sender,
  );

  if (matchingUser < 1) return false;

  return true;
};
