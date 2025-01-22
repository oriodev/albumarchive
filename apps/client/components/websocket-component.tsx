"use client";

import { WebsocketContext } from "@/utils/providers/WebsocketProvider";
import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useUser } from "@/utils/providers/UserProvider";
import { NotificationType } from "@/types";
import { sendNotification } from "@/utils/notifications.utils";

export function WebsocketComponent() {
  const socket = useContext(WebsocketContext);
  const [messages, setMessages] = useState<string>("");
  const { user } = useUser();

  const sendMyNotification = async () => {
    if (!user?._id) {
      return;
    }

    const notificationPayload = {
      sender: user?._id,
      receiver: "676c36114bcb0152801f52fa",
      type: NotificationType.FRIENDREQUEST,
    };

    const store = await sendNotification(notificationPayload);

    console.log("store: ", store);

    socket?.emit("newNotification", "new friend request!");
  };

  useEffect(() => {
    socket?.on("connect", () => {
      console.log("connected");
    });

    socket?.on("onNotification", (data) => {
      console.log("onNotification received");
      console.log("data: ", data);
      console.log("data.content: ", data.content);
      setMessages(data.content);
    });

    return () => {
      console.log("unregistering");
      socket?.off("connect");
      socket?.off("onNotifications");
    };
  }, []);

  return (
    <div>
      <p>websocket component</p>
      <p>{messages}</p>
      <Button onClick={sendMyNotification}></Button>
    </div>
  );
}
