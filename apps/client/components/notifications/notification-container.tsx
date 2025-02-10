"use client";

import { useToast } from "@/hooks/use-toast";
// COMPONENTS.

// TYPES.
import { Notification, NotificationType, User } from "@/types";
import {
  handleAcceptAlbumRec,
  handleDeclineNotification,
  handleRemoveNotification,
  sendNotification,
} from "@/utils/notifications.utils";
import { Socket } from "socket.io-client";
import { followUser } from "@/api/user.api";
import NotifCard from "../cards/notifcard";

export function NotificationContainer({
  notifications,
  setNotifications,
  socket,
  updateUserInfo,
}: {
  notifications: Notification[];
  setNotifications: (
    notifications: Notification[] | ((prev: Notification[]) => Notification[]),
  ) => void;
  socket: Socket | null;
  updateUserInfo: (update: Partial<User>) => void;
}) {
  const { toast } = useToast();

  return (
    <div className="max-h-[600px] overflow-y-auto flex flex-col gap-5">
      {notifications.map((notification, index) => {
        // ALBUM REC NOTIFICATIONS.
        if (notification.type === NotificationType.ALBUMREC) {
          if (!notification.album || !socket) return;

          const acceptFunction = async () => {
            const accepted = await handleAcceptAlbumRec(
              notification,
              setNotifications,
              socket,
              updateUserInfo,
            );

            if (accepted) {
              toast(accepted);
            }
          };

          const declineFunction = async () => {
            if (!notification.album) return;

            return await handleDeclineNotification(
              notification,
              setNotifications,
              `${notification.receiver.username} doesn't want to listen to ${notification.album.title} by ${notification.album.artist}`,
              socket,
            );
          };

          const title = `${notification.sender.username} recommended
              ${notification.album.title} by ${notification.album.artist}!`;

          return (
            <NotifCard
              key={index}
              image={notification.album.coverImage}
              type={NotificationType.ALBUMREC}
              title={title}
              description={notification.message || ""}
              link={`/central/albums/${notification.album._id}`}
              handleAcceptNotification={acceptFunction}
              handleDeclineNotification={declineFunction}
            />
          );
        }

        // FRIEND REQUEST NOTIFICATIONS.
        if (notification.type === NotificationType.FRIENDREQUEST) {
          const title = `${notification.sender.username} wants to follow you!`;

          const acceptFunction = async () => {
            const follow = await followUser(
              notification.receiver._id,
              notification.sender._id,
            );

            if (!follow) {
              toast({
                title: "Could not do follow.",
              });
              return;
            }

            const returnNotificationPayload = {
              sender: notification.receiver,
              receiver: notification.sender,
              type: NotificationType.RESPONSE,
              message: `${notification.receiver.username} has accepted your friend request!`,
            };

            await sendNotification(socket, returnNotificationPayload);

            handleRemoveNotification(notification, setNotifications);
            toast({
              title: `${notification.sender.username} now follows you!`,
            });
          };

          const declineFunction = async () => {
            if (!notification.album || !socket) return;

            return await handleDeclineNotification(
              notification,
              setNotifications,
              `${notification.receiver.username} has declined your friend request :(`,
              socket,
            );
          };

          return (
            <NotifCard
              key={index}
              image={notification.sender.profileImg}
              type={NotificationType.FRIENDREQUEST}
              title={title}
              description={""}
              link={`/central/users/${notification.sender.username}`}
              handleAcceptNotification={acceptFunction}
              handleDeclineNotification={declineFunction}
            />
          );
        }

        // RESPONSE NOTIFICATIONS.
        if (notification.type === NotificationType.RESPONSE) {
          const declineFunction = async () => {
            handleRemoveNotification(notification, setNotifications);
          };

          return (
            <NotifCard
              key={index}
              image={notification.sender.profileImg}
              type={NotificationType.RESPONSE}
              title={notification.message || "this is an empty response"}
              description={""}
              link={`/central/users/${notification.sender._id}`}
              handleAcceptNotification={() => {}}
              handleDeclineNotification={declineFunction}
            />
          );
        }
      })}
    </div>
  );
}
