"use client";

// TYPES.
import { Notification, NotificationType } from "@/types";

// COMPONENTS.

// HOOKS.
import { useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";

// API CALLS.
import { getNotifications } from "@/api/notifications.api";
import { Skeleton } from "../ui/skeleton";
import { NotificationCardsDisplay } from "./notification-cards-display";

export function NotificationContainer({
  selectedFilter,
}: {
  selectedFilter: string;
}) {
  // USE STATES.
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
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
      setFilteredNotifications(fetchedNotifications);

      console.log("fetchedNotifications: ", fetchedNotifications);
      setLoading(false);
    };

    fetchNotifications();
  }, [user]);

  // FILTER MAPPING
  const filterMapping: Record<string, NotificationType | null> = {
    "Friend Requests": NotificationType.FRIENDREQUEST,
    "Album Recs": NotificationType.ALBUMREC,
    Likes: NotificationType.LISTLIKE,
    Activity: null,
  };

  // SET FILTERS.
  useEffect(() => {
    const filterNotifications = () => {
      const notificationType = filterMapping[selectedFilter];

      if (notificationType) {
        setFilteredNotifications(
          notifications.filter(
            (notification) => notification.type === notificationType,
          ),
        );
      } else {
        setFilteredNotifications(notifications);
      }
    };

    filterNotifications();
    // eslint-disable-next-line
  }, [selectedFilter, notifications]);

  return (
    <div className="w-full lg:w-1/2">
      <div className="flex flex-col gap-5">
        {loading ? (
          Array.from({ length: filteredNotifications.length }).map(
            (_, index) => <Skeleton key={index} className="h-[100px] w-full" />,
          )
        ) : (
          <NotificationCardsDisplay
            notifications={filteredNotifications}
            setNotifications={setNotifications}
          />
        )}
      </div>
    </div>
  );
}
