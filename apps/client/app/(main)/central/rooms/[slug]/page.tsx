"use client";

// TYPES.
import { Message, MessageType, Room, User } from "@/types";

// HOOKS.
import { useContext, useEffect, useRef, useState } from "react";
import { WebsocketContext } from "@/utils/providers/WebsocketProvider";
import { useUser } from "@/utils/providers/UserProvider";

// COMPONENTS.
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import RoomTopbar from "@/components/roomtopbar";

// API CALL.
import { removeUserFromRoom } from "@/api/rooms.api";

// UTILS.
import {
  fetchMessages,
  fetchRoom,
  handleJoined,
  handleLeave,
  handleSendMessage,
  registerUser,
  scrollToBottom,
} from "../(utils)/rooms.utils";
import MessageContainer from "@/components/containers/messagecontainer";
import SimpleUserCard from "@/components/cards/simpleusercard";
import { SendAlbumPopover } from "@/components/dropdowns/sendalbumpopover";
import { SendListPopover } from "@/components/dropdowns/sendlistpopover";

// PROPS.
interface Props {
  params: Promise<{ slug: string }>;
}

export default function Page({ params }: Props) {
  // HOOKS.
  const socket = useContext(WebsocketContext);
  const { user } = useUser();

  // STATES.
  const [room, setRoom] = useState<Room | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // REFS.
  const usersRef = useRef<User[]>([]);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(
    function getRoom() {
      fetchRoom(params, setRoom, setUsers);
    },
    [params],
  );

  useEffect(
    function getMessages() {
      fetchMessages(room, setMessages, setLoading);
    },
    [room],
  );

  useEffect(
    function handleSocket() {
      if (!socket || !room || !user) return;

      registerUser(socket, user, room);
      socket.on("joined", (joined) => handleJoined(joined, usersRef, setUsers));
      socket.on("left", (left) => handleLeave(left, usersRef, setUsers));
      socket.on("receiveMessage", (message) =>
        setMessages((prev) => [...prev, message]),
      );

      return () => {
        socket.emit("leaveRoom", room.slug);
        removeUserFromRoom(user._id, room._id);
        socket.off("joined");
        socket.off("receiveMessage");
        socket.off("left");
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [socket, room],
  );

  useEffect(function handleWindowClose() {
    if (!socket || !room || !user) return;

    const handleBeforeClose = (event: {
      preventDefault: () => void;
      returnValue: string;
    }) => {
      socket.emit("leaveRoom", room.slug);
      removeUserFromRoom(user._id, room._id);
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeClose);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeClose);
    };
  });

  const onSendMessage = () => {
    if (!user || !socket || !room || message.trim() === "") return;
    return handleSendMessage({
      user,
      socket,
      room,
      message,
      type: MessageType.MESSAGE,
      setMessage: setMessage,
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onSendMessage();
      event.preventDefault();
    }
  };

  useEffect(
    function handleContainerScroll() {
      scrollToBottom(endOfMessagesRef);
      if (inputRef.current) inputRef.current.focus();
    },
    [messages],
  );

  return (
    <>
      {/* LOADING STATE. */}
      {loading ? (
        <div
          className="flex flex-col gap-5 overflow-hidden"
          style={{ height: "calc(100vh - 5rem)" }}
        >
          <div>
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="flex-1 overflow-auto border-t border-b border-zinc-600">
            <Skeleton className="h-1/2 w-full" />
          </div>

          <div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ) : (
        // ROOM STATE.
        room &&
        users &&
        socket && (
          <div
            className="flex flex-col"
            style={{ height: "calc(100vh - 5rem)" }}
          >
            <RoomTopbar title={`${room.title} Room`} />

            <div className="flex flex-row gap-5 overflow-hidden">
              <div className="flex flex-1 flex-col gap-5 ">
                <MessageContainer
                  messages={messages}
                  endOfMessagesRef={endOfMessagesRef}
                  room={room}
                  setMessages={setMessages}
                />

                <div className="flex gap-2 p-2 ">
                  <SendAlbumPopover room={room} socket={socket} />
                  <SendListPopover room={room} socket={socket} />
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    ref={inputRef}
                  />
                  <Button
                    onClick={onSendMessage}
                    variant={"dark"}
                    className="pl-8 pr-8"
                  >
                    Send
                  </Button>
                </div>
              </div>

              <div className="w-1/4 md:w-1/6 overflow-hidden border border-zinc-600 p-5 hidden md:block">
                <h3 className="text-xl font-bold">Online - {users.length}.</h3>
                <div>
                  {users.map((user, index) => (
                    <SimpleUserCard
                      key={index}
                      title={user.username}
                      image={user.profileImg}
                      link={`/central/users/${user.username}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
}
