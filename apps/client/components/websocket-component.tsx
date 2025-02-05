"use client";

import { WebsocketContext } from "@/utils/providers/WebsocketProvider";
import { useContext, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { useUser } from "@/utils/providers/UserProvider";

export function WebsocketComponent() {
  const socket = useContext(WebsocketContext);
  const [messages, setMessages] = useState<string>("");
  const { user } = useUser();

  const notifOne = {
    sender: user?._id,
    receiver: "677ec13a017490543583fb1e",
    type: "albumRec",
    albumId: "sdfdsfdsf",
    message: "sup broski ily <3",
  };

  const sendLiveNotification = () => {
    if (!socket) {
      console.log("no socket");
      return;
    }

    console.log("notification: ", notifOne);
    socket.emit("newNotification", notifOne);
  };

  // CONNECTING & LISTENING.
  useEffect(() => {
    if (user?._id && socket) {
      socket.emit("registerUser", user._id);
    }

    socket?.on("onNotification", (data) => {
      setMessages(data.message);
    });

    return () => {
      socket?.off("onNotification");
    };
  }, [socket, user]);

  return (
    <div>
      <p>websocket component</p>
      <p>{messages}</p>
      <Button onClick={() => sendLiveNotification()}>send notification</Button>
    </div>
  );
}
