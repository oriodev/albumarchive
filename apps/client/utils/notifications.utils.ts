// TYPES.
import {
  List,
  Notification,
  NotificationPayload,
  NotificationType,
  User,
} from "@/types";

// API CALLS.
import {
  getNotifications,
  removeNotification,
  storeNotification,
} from "@/api/notifications.api";
import { Socket } from "socket.io-client";
import { isAlbumInListened, isAlbumInToListen } from "./lists.utils";
import { addAlbumToList, getListsByUserId } from "@/api/list.api";
import { makeUpdatedAlbumInListUser } from "./user.utils";

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

  const allNotifications = await getNotifications(notification.receiver._id);

  if (!allNotifications) {
    return false;
  }

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

/**
 * removes notification from db and filters out of state.
 * @param notification
 * @param setNotifications
 * @returns
 */
export const handleRemoveNotification = async (
  notification: Notification,
  setNotifications: (
    notifications: Notification[] | ((prev: Notification[]) => Notification[]),
  ) => void,
) => {
  const id = notification._id;

  const removedNotification = await removeNotification(id);
  setNotifications((prevNotifications: Notification[]) =>
    prevNotifications.filter((notif) => notif._id !== id),
  );

  return removedNotification;
};

/**
 * decline an album rec or friend request. sends response notification.
 * @param notification
 * @param setNotifications
 * @param message
 * @param socket
 */
export const handleDeclineNotification = async (
  notification: Notification,
  setNotifications: (
    notifications: Notification[] | ((prev: Notification[]) => Notification[]),
  ) => void,
  message: string,
  socket: Socket,
) => {
  handleRemoveNotification(notification, setNotifications);

  const returnNotificationPayload = {
    sender: notification.receiver,
    receiver: notification.sender,
    type: NotificationType.RESPONSE,
    message,
  };

  await sendNotification(socket, returnNotificationPayload);
};

/**
 * accepts an album rec.
 * @param notification
 * @param setNotifications
 * @param socket
 * @param updateUserInfo
 * @returns toast info
 */
export const handleAcceptAlbumRec = async (
  notification: Notification,
  setNotifications: (
    notifications: Notification[] | ((prev: Notification[]) => Notification[]),
  ) => void,
  socket: Socket,
  updateUserInfo: (update: Partial<User>) => void,
) => {
  const user = notification.receiver;
  const userLists = await getListsByUserId(user._id);
  const userWithLists = { ...user, lists: userLists };

  if (!notification.album || !user.lists) return null;

  const albumInListNotificationPayload = {
    sender: notification.receiver,
    receiver: notification.sender,
    type: NotificationType.RESPONSE,
    message: `${user?.username} has already listened to ${notification.album.title} by ${notification.album.artist}`,
  };

  const albumInLists =
    (await isAlbumInListened(userWithLists, notification.album)) ||
    (await isAlbumInToListen(userWithLists, notification.album));

  if (albumInLists) {
    await sendNotification(socket, albumInListNotificationPayload);
    handleRemoveNotification(notification, setNotifications);
    return { title: "you already listened to this album" };
  }

  const toListen = userWithLists.lists.filter(
    (list: List) => list.type === "To Listen",
  )[0];
  if (!toListen._id || !notification.album._id) return null;

  const addToListen = await addAlbumToList(
    toListen._id,
    notification.album._id,
  );

  // UPDATE IN USER PROVIDER.

  const additionUpdate = makeUpdatedAlbumInListUser(
    userWithLists,
    toListen._id,
    notification.album._id,
  );

  if (!additionUpdate) return null;
  updateUserInfo(additionUpdate);

  // SEND RETURN NOTIFICATIONS.
  if (addToListen) {
    const addToListNotificationPayload = {
      sender: notification.receiver,
      receiver: notification.sender,
      type: NotificationType.RESPONSE,
      message: `${user?.username} is going to BLOOP listen to ${notification.album.title} by ${notification.album.artist}`,
    };

    await sendNotification(socket, addToListNotificationPayload);
  }

  handleRemoveNotification(notification, setNotifications);
  return { title: "album added to your To Listen list!" };
};
