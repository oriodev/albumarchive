"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AlbumType, List, MessageType, Room } from "@/types";
import { useUser } from "@/utils/providers/UserProvider";
import { List as ListIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ListComboBox } from "../comboboxes/listcombobox";
import { Socket } from "socket.io-client";
import { handleSendMessage } from "@/app/(main)/central/rooms/(utils)/rooms.utils";
import { getUserLikedLists } from "@/api/likes.api";

interface Props {
  room: Room;
  socket: Socket;
}

export function SendListPopover({ room, socket }: Props) {
  // HOOKS.
  const { user } = useUser();

  // STATES.
  const [lists, setLists] = useState<List[]>([]);
  const [list, setList] = useState<List | undefined>();

  useEffect(
    function fetchLists() {
      const fetchLikedLists = async () => {
        if (!user) return;

        const filteredLists = user.lists.filter(
          (list) =>
            list.type !== AlbumType.LISTENED &&
            list.type !== AlbumType.TOLISTEN,
        );

        const fetchedLikedLists = await getUserLikedLists(user._id);
        if (fetchedLikedLists) {
          setLists([...fetchedLikedLists, ...filteredLists]);
        } else {
          setLists(filteredLists);
        }
      };

      fetchLikedLists();
    },
    [user],
  );

  const sendList = () => {
    if (!user) return;
    handleSendMessage({
      user,
      socket,
      room,
      message: "",
      type: MessageType.LIST,
      list,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"dark"}>
          <ListIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Send a List</h4>
            <p className="text-sm text-muted-foreground">
              Send the room your favourite lists!
            </p>
          </div>
          <div className="flex gap-2">
            {lists && <ListComboBox lists={lists} setList={setList} />}
            <Button variant={"dark"} onClick={sendList}>
              Send
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
