import { ImageType, Message, Room } from "@/types";
import dayjs from "dayjs";
import MessageCard from "../cards/messagecard";
import { MutableRefObject } from "react";
import React from "react";

interface Props {
  messages: Message[];
  endOfMessagesRef: MutableRefObject<HTMLDivElement | null>;
  room: Room;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export default function MessageContainer({
  messages,
  endOfMessagesRef,
  room,
  setMessages,
}: Props) {
  return (
    <div className="flex-1 overflow-auto rounded-lg bg-zinc-950">
      <div className="p-4 flex flex-col gap-7">
        {messages.map((message, index) => {
          const now = dayjs();
          const isToday = dayjs(message.timestamp).isSame(now, "day");
          const messageDate = dayjs(message.timestamp).format("YYYY-MM-DD");
          const dateBreak = dayjs(message.timestamp).format("D MMMM YYYY");

          const showDateBreak =
            index === 0 ||
            messageDate !==
              dayjs(messages[index - 1].timestamp).format("YYYY-MM-DD");

          return (
            <React.Fragment key={message.timestamp}>
              {showDateBreak && (
                <div className="">{isToday ? "Today" : dateBreak}</div>
              )}
              <MessageCard
                fullMessage={message}
                size={50}
                imageType={ImageType.user}
                room={room.slug}
                setMessages={setMessages}
              />
            </React.Fragment>
          );
        })}
        <div ref={endOfMessagesRef} />
      </div>
    </div>
  );
}
