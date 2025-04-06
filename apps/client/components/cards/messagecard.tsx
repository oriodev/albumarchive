"use client";

import { ImageType, Message } from "@/types";
import ImageLoader from "../general/imageloader";
import { useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";
import { Trash } from "lucide-react";
import { deleteMessage } from "@/apis/messages.api";
import { formatDate, formatLocaltime } from "@/utils/time.utils";
import dayjs from "dayjs";
import Link from "next/link";
import { Skeleton } from "../ui/skeleton";

interface Props {
  fullMessage: Message;
  size: number;
  imageType: ImageType;
  room: string;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

/**
 * for messages in a room.
 */
export default function MessageCard({ fullMessage, room, setMessages }: Props) {
  // HOOKS.
  const { user } = useUser();

  // STATES.
  const [hovered, setHovered] = useState(false);

  const { timestamp, sender, content, album, list } = fullMessage;
  const username = sender.username;
  const listOwner = list?.user;

  // HANDLE DELETE.
  const handleDelete = async () => {
    const deletedMessage = await deleteMessage(room, timestamp);
    setMessages((prevMessages: Message[]) =>
      prevMessages.filter(
        (message: Message) =>
          !(
            message.sender.username === sender.username &&
            message.timestamp === timestamp
          ),
      ),
    );
    if (!deletedMessage) return;
  };

  const now = dayjs();
  const isToday = dayjs(timestamp).isSame(now, "day");
  const date = formatDate(timestamp);
  const time = formatLocaltime(timestamp);
  const formattedTimestamp = isToday ? time : date;

  return (
    <div
      className="relative flex flex-row gap-5"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-cy="message"
    >
      <div className="flex-none"></div>
      <div className="flex-1">
        <div className="flex flex-row gap-2">
          <p className="font-bold">{username}</p>
          <p className="text-gray-400">{formattedTimestamp}</p>
        </div>
        <p>{content}</p>
        {album && (
          <Link href={`/central/albums/${album._id}`} target="_blank">
            <div className="bg-cyan-950 p-3 rounded-lg flex gap-3 mt-3 border border-cyan-950 hover:border-cyan-500 hover:cursor-pointer transition">
              <ImageLoader
                image={album.coverImage}
                size={50}
                type={ImageType.album}
              />
              <div>
                <p className="text-lg">{album.title}</p>
                <p>by {album.artist}</p>
              </div>
            </div>
          </Link>
        )}
        {list &&
          (listOwner ? (
            <Link
              href={`/central/users/${listOwner.username}/${list.slug}`}
              target="_blank"
            >
              <div className="bg-indigo-950 p-3 rounded-lg flex gap-3 mt-3 border border-indigo-950 hover:border-indigo-500 hover:cursor-pointer transition">
                <ImageLoader
                  image={list.listCoverImg}
                  size={50}
                  type={ImageType.list}
                />
                <div>
                  <p className="text-lg">{list.name}</p>
                  <p>by {listOwner.username}</p>
                </div>
              </div>
            </Link>
          ) : (
            <Skeleton className="bg-indigo-950 p-3 rounded-lg flex gap-3 mt-3 border border-indigo-950 hover:border-indigo-500 hover:cursor-pointer transition h-[79px]" />
          ))}
      </div>
      {hovered && user && username === user.username && (
        <div className="absolute top-0 right-0 mt-1 mr-1 flex flex-row gap-2 bg-zinc-900 shadow-md p-1 pl-2 pr-2 rounded-lg">
          <Trash
            size={17}
            className="hover:cursor-pointer"
            onClick={handleDelete}
            data-cy="deleteMessageBtn"
          />
        </div>
      )}
    </div>
  );
}
