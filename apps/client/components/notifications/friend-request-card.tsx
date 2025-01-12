"use client";

// COMPONENTS.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// TYPES.
import { Notification, User } from "@/types";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { removeNotification } from "@/api/notifications.api";
import { ImageFallback } from "../image-fallback";
import { followUser } from "@/api/user.api";
import { useToast } from "@/hooks/use-toast";

export function FriendRequestCard({
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
  // HOOKS.
  const { toast } = useToast();

  // HANDLE DELETE.
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

  // HANDLE ACCEPT.
  const handleAcceptNotification = async () => {
    console.log("accepting:", notification);
    const follow = await followUser(notification.receiver, notification.sender);

    if (!follow) {
      toast({
        title: "Could not follow.",
      });
      return;
    }

    handleRemoveNotification();
    toast({
      title: "Followed.",
    });
  };

  return (
    <div>
      <Card className="flex gap-5">
        <div className="mr-4 relative w-[200px]">
          <ImageFallback />
        </div>
        <div className="flex flex-col w-full">
          <CardHeader>
            <CardTitle>{sender?.username} wants to follow you!</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleAcceptNotification}>Accept</Button>
              <Button onClick={handleRemoveNotification}>Decline</Button>
            </div>
            <div className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded">
              <Trash onClick={handleRemoveNotification} size={20} />
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
