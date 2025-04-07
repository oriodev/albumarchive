"use client";

import { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const WebsocketContext = createContext<Socket | null>(null);

export const WebsocketProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(process.env.NEXT_PUBLIC_BACKEND_API, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("onNotification", () => {
      console.log("connected");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <WebsocketContext.Provider value={socket}>
      {children}
    </WebsocketContext.Provider>
  );
};
