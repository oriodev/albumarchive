"use client";

// TYPES.
import { Notification } from "@/types";

// COMPONENTS.

// HOOKS.
import { useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";

// API CALLS.
import { getNotifications } from "@/api/notifications.api";
import { Skeleton } from "../ui/skeleton";
import { NotificationCardsDisplay } from "./notification-cards-display";

export function SidebarNotifications() {
  // USE STATES.
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // HOOKS.
  const { user } = useUser();

  // LOAD DATA.
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?._id) {
        return;
      }

      setLoading(true);

      // SET NOTIFICATIONS FROM DB.
      const fetchedNotifications = await getNotifications(user._id);
      setNotifications(fetchedNotifications);

      setLoading(false);
    };

    fetchNotifications();
  }, [user]);

  return (
    <div className="w-full lg:w-1/2">
      <div className="flex flex-col gap-5">
        {loading ? (
          Array.from({ length: notifications.length }).map((_, index) => (
            <Skeleton key={index} className="h-[100px] w-full" />
          ))
        ) : (
          <NotificationCardsDisplay
            notifications={notifications}
            setNotifications={setNotifications}
          />
        )}
      </div>
    </div>
  );
}
