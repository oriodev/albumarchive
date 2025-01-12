"use client";

// TYPES.
import { Notification, NotificationType, User } from "@/types";

// COMPONENTS.

// HOOKS.
import { useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";

// API CALLS.
import { getNotifications } from "@/api/notifications.api";
import { getUser } from "@/api/user.api";
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
  const [senders, setSenders] = useState<Record<string, User>>({});
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

      // GET ALL THE USERS THAT SENT NOTIFICATIONS.
      const senderPromises = fetchedNotifications.map(
        async (notif: Notification) => {
          const fetchedSender = await getUser(notif.sender);
          return { id: notif.sender, user: fetchedSender };
        },
      );

      const senderResults = await Promise.all(senderPromises);
      const senderMap = senderResults.reduce(
        (acc, { id, user }) => {
          if (user) {
            acc[id] = user;
          }
          return acc;
        },
        {} as Record<string, User>,
      );

      setSenders(senderMap);
      setLoading(false); // Set loading to false after fetching
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
            senders={senders}
          />
        )}
      </div>
    </div>
  );
}
