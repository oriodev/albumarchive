"use client";

import { CloudLightning, SquareArrowOutUpRight } from "lucide-react";

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
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";
import { WebsocketContext } from "@/utils/providers/WebsocketProvider";
import { SidebarNotifications } from "../notifications/sidebar-notifications";

export function NavActivity() {
  const { isMobile } = useSidebar();
  const router = useRouter();
  const { user } = useUser();
  const socket = useContext(WebsocketContext);

  const [notificationCount, setNotificationCount] = useState(0);

  // WEBSOCKETS.
  // ------------------

  // CONNECTING & LISTENING.
  useEffect(() => {
    if (user?._id && socket) {
      socket.emit("registerUser", user._id);
    }

    socket?.on("onNotification", () => {
      setNotificationCount((prev) => prev + 1);
    });

    return () => {
      socket?.off("onNotification");
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
                  <SquareArrowOutUpRight
                    onClick={() => router.push("/central/activity")}
                    className="hover:cursor-pointer hover:text-gray-300"
                  />
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <SidebarNotifications />
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
