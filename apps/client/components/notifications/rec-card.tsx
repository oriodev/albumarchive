"use client";

// COMPONENTS.
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// TYPES.
import { Album, Notification, NotificationType, User } from "@/types";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { removeNotification } from "@/api/notifications.api";
import { ImageFallback } from "../image-fallback";
import { useEffect, useState } from "react";
import { getAlbumById } from "@/api/albums.api";
import Image from "next/image";
import { isAlbumInListened, isAlbumInToListen } from "@/utils/lists.utils";
import { useUser } from "@/utils/providers/UserProvider";
import { sendNotification } from "@/utils/notifications.utils";
import { addAlbumToList } from "@/api/list.api";
import { useToast } from "@/hooks/use-toast";
import { makeUpdatedAlbumInListUser } from "@/utils/user.utils";

export function RecCard({
  notification,
  setNotifications,
  sender,
}: {
  notification: Notification;
  setNotifications: (
    notifications: Notification[] | ((prev: Notification[]) => Notification[]),
  ) => void;
  sender?: User;
}) {
  // USE HOOKS.
  const { user, updateUserInfo } = useUser();
  const { toast } = useToast();

  // USE STATE.
  const [album, setAlbum] = useState<Album | null>(null);

  useEffect(() => {
    const fetchAlbum = async () => {
      if (!notification.albumId) return;
      const fetchedAlbum = await getAlbumById(notification.albumId);
      if (!fetchedAlbum) return;
      setAlbum(fetchedAlbum);
    };

    fetchAlbum();
  }, [notification]);

  //   HANDLE DELETE.
  const handleRemoveNotification = async () => {
    const id = notification?._id;

    if (!id) {
      return null;
    }

    const removedNotification = await removeNotification(id);
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notif) => notif._id !== id),
    );

    return removedNotification;
  };

  const handleDeclineNotification = async () => {
    handleRemoveNotification();

    if (!album) return;

    const returnNotificationPayload = {
      sender: notification.receiver,
      receiver: notification.sender,
      type: NotificationType.RESPONSE,
      message: `${user?.username} doesn't want to listen to ${album.title} by ${album.artist}`,
    };

    await sendNotification(returnNotificationPayload);
  };

  // HANDLE ACCEPT.
  const handleAcceptNotification = async () => {
    if (!album || !user?.lists) return null;

    const albumInListNotificationPayload = {
      sender: notification.receiver,
      receiver: notification.sender,
      type: NotificationType.RESPONSE,
      message: `${user?.username} has already listened to ${album.title} by ${album.artist}`,
    };

    const albumInLists =
      (await isAlbumInListened(user, album)) ||
      (await isAlbumInToListen(user, album));

    if (albumInLists) {
      await sendNotification(albumInListNotificationPayload);

      toast({
        title: "you already listened to this album",
      });

      handleRemoveNotification();
      return;
    }

    const toListen = user.lists.filter((list) => list.type === "To Listen")[0];
    if (!toListen._id || !album._id) return;

    const addToListen = await addAlbumToList(toListen._id, album._id);

    // UPDATE IN USER PROVIDER.

    const additionUpdate = makeUpdatedAlbumInListUser(
      user,
      toListen._id,
      album._id,
    );

    if (!additionUpdate) return;

    updateUserInfo(additionUpdate);

    // SEND RETURN NOTIFICATIONS.
    if (addToListen) {
      const addToListNotificationPayload = {
        sender: notification.receiver,
        receiver: notification.sender,
        type: NotificationType.RESPONSE,
        message: `${user?.username} is going to listen to ${album.title} by ${album.artist}`,
      };

      await sendNotification(addToListNotificationPayload);
    }

    toast({
      title: "album added to your To Listen list",
    });

    handleRemoveNotification();
  };

  return (
    <div>
      <Card className="flex gap-5">
        <div className="mr-4 relative w-[200px]">
          {album?.coverImage ? (
            <Image
              alt={album?.title || "album cover image"}
              src={album?.coverImage || ""}
              width={200}
              height={200}
            />
          ) : (
            <ImageFallback />
          )}
        </div>
        <div className="flex flex-col w-full">
          <CardHeader>
            <CardTitle>
              {sender?.username} recommended {album?.title} by {album?.artist}!
            </CardTitle>
            <CardDescription>{notification.message}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAcceptNotification}>Accept</Button>
              <Button onClick={handleDeclineNotification}>Decline</Button>
            </div>
            <div className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded">
              <Trash2 onClick={() => handleRemoveNotification()} size={20} />
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
