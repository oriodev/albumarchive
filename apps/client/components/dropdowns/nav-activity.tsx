"use client";

// COMPONENTS.
import { CloudLightning } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// HOOKS.
import { useContext, useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";
import { WebsocketContext } from "@/utils/providers/WebsocketProvider";

// API CALLS.
import { getNotifications } from "@/api/notifications.api";

// TYPES.
import { Notification } from "@/types";
import { NotificationContainer } from "../containers/notification-container";

export function NavActivity() {
  const { isMobile } = useSidebar();
  const { user, updateUserInfo } = useUser();
  const socket = useContext(WebsocketContext);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationCount, setNotificationCount] = useState(0);

  // FETCH NOTIFICATIONS FROM DATABASE.
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      const fetchedNotifications = await getNotifications(user._id);
      setNotifications(fetchedNotifications);
    };

    fetchNotifications();
  }, [user]);

  useEffect(() => {
    setNotificationCount(notifications.length);
  }, [notifications]);

  // WEBSOCKETS.
  // ------------------

  // CONNECTING & LISTENING.
  useEffect(() => {
    if (!socket) return;

    if (user) {
      socket.emit("registerUser", user._id);
    }

    socket.on("onNotification", (notification) => {
      setNotifications((prev: Notification[]) => [notification, ...prev]);
    });

    return () => {
      socket.off("onNotification");
    };
  }, [socket, user]);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="default"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <CloudLightning />
              <div className="flex justify-between flex-1 text-left text-sm leading-tight">
                <span className="truncate">Activity</span>
                <span className="flex justify-center items-center bg-rose-800 text-white rounded-full h-5 w-5 font-semibold">
                  {notificationCount}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[500px] min-w-56 rounded-lg p-2"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="flex justify-between flex-1 text-left text-sm leading-tight">
                  <p className="text-lg font-semibold">Activity</p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="w-full">
              <NotificationContainer
                notifications={notifications}
                setNotifications={setNotifications}
                socket={socket}
                updateUserInfo={updateUserInfo}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
