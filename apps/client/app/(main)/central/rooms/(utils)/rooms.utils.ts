import { getMessages, storeMessage } from "@/apis/messages.api";
import { addUserToRoom, getRoom } from "@/apis/rooms.api";
import { getUser } from "@/apis/user.api";
import {
  Album,
  List,
  Message,
  MessagePayload,
  MessageType,
  Room,
  User,
} from "@/types";
import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

/**
 * fetch the room from the db.
 * @param params
 * @param setRoom
 * @param setUsers
 * @returns
 */
export const fetchRoom = async (
  params: Promise<{ slug: string }>,
  setRoom: (room: Room) => void,
  setUsers: (users: User[]) => void,
) => {
  const slug = (await params).slug;
  const fetchedRoom = await getRoom(slug);
  if (!fetchedRoom) return;
  setRoom(fetchedRoom);
  setUsers(fetchedRoom.users);
};

/**
 * fetch the messages for a room from the db.
 * @param room
 * @param setMessages
 * @param setLoading
 * @returns
 */
export const fetchMessages = async (
  room: Room | null,
  setMessages: (messages: Message[]) => void,
  setLoading: (loading: boolean) => void,
) => {
  if (!room) return;
  const fetchedMessages = await getMessages(room.slug);
  setMessages(fetchedMessages);
  setLoading(false);
};

/**
 * register a user in the socket and join the room in socket and db.
 * @param socket
 * @param user
 * @param room
 */
export const registerUser = async (socket: Socket, user: User, room: Room) => {
  socket.emit("registerUser", user._id);
  socket.emit("joinRoom", room.slug);
  await addUserToRoom(user._id, room._id);
};

/**
 * handle a user joining the room.
 * @param joined
 * @param usersRef
 * @param setUsers
 * @returns
 */
export const handleJoined = async (
  joined: { userId: string },
  usersRef: { current: User[] },
  setUsers: (users: (prev: User[]) => User[]) => void,
) => {
  const fetchedUser = await getUser(joined.userId);
  if (
    !fetchedUser ||
    usersRef.current.some((user) => user._id === fetchedUser._id)
  )
    return;

  setUsers((prev) => {
    const updatedUsers = [...prev, fetchedUser];
    usersRef.current = updatedUsers;
    return updatedUsers;
  });
};

/**
 * handle a user leaving a room.
 * @param left
 * @param usersRef
 * @param setUsers
 */
export const handleLeave = (
  left: { userId: string },
  usersRef: { current: User[] },
  setUsers: (users: (prev: User[]) => User[]) => void,
) => {
  setUsers((prevUsers) => {
    const updatedUsers = prevUsers.filter((user) => user._id !== left.userId);
    usersRef.current = updatedUsers;
    return updatedUsers;
  });
};

interface handleSendMessageProps {
  user: User;
  socket: Socket;
  room: Room;
  message: string;
  type: MessageType;
  album?: Album;
  list?: List;
  setMessage?: (message: string) => void;
}

/**
 * handle sending a message via socket and db.
 * @param user
 * @param socket
 * @param room
 * @param message
 * @param storeMessage
 * @param setMessage
 */
export const handleSendMessage = ({
  user,
  socket,
  room,
  message,
  type,
  album,
  list,
  setMessage,
}: handleSendMessageProps) => {
  const dbPayload: MessagePayload = {
    room: room.slug,
    sender: user,
    content: message,
    timestamp: new Date().toISOString(),
    type,
    album: album?._id,
    list: list?._id,
  };

  const socketPayload: Message = {
    room: room.slug,
    sender: user,
    content: message,
    timestamp: new Date().toISOString(),
    type,
    album,
    list,
  };

  socket.emit("sendMessage", socketPayload);
  storeMessage(dbPayload);

  if (setMessage) setMessage("");
};

/**
 * handles scrolling to the bottom of a container.
 * @param endOfMessagesRef
 */
export const scrollToBottom = (
  endOfMessagesRef: MutableRefObject<HTMLDivElement | null>,
) => {
  endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
};
