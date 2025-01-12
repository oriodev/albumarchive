"use client";

// COMPONENTS.
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// TYPES.
import { Notification, User } from "@/types";
import { Button } from "../ui/button";
import { Trash } from "lucide-react";
import { removeNotification } from "@/api/notifications.api";
import { ImageFallback } from "../image-fallback";

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

  return (
    <div>
      <Card className="flex gap-5">
        <div className="mr-4 relative w-[200px]">
          <ImageFallback />
        </div>
        <div className="flex flex-col w-full">
          <CardHeader>
            <CardTitle>{sender?.username} recommended x album!</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button>Accept</Button>
              <Button>Decline</Button>
            </div>
            <div className="hover:cursor-pointer flex items-center justify-center w-8 h-8 rounded">
              <Trash onClick={() => handleRemoveNotification()} size={20} />
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
