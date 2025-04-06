"use client";

// API CALLS.
import { getListById } from "@/apis/list.api";

// COMPONENTS.
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Album as AlbumIcon } from "lucide-react";
import { AlbumComboBox } from "../comboboxes/albumcombobox";

// TYPES.
import { Album, MessageType, Room } from "@/types";

// HOOKS.
import { useEffect, useState } from "react";
import { useUser } from "@/utils/providers/UserProvider";
import { Socket } from "socket.io-client";
import { handleSendMessage } from "@/app/(main)/central/rooms/(utils)/rooms.utils";

interface Props {
  room: Room;
  socket: Socket;
}

export function SendAlbumPopover({ room, socket }: Props) {
  // HOOKS.
  const { user } = useUser();

  // STATES.
  const [albums, setAlbums] = useState<Album[]>([]);
  const [album, setAlbum] = useState<Album | undefined>();

  useEffect(
    function fetchAlbums() {
      if (!user) return;

      const listId = user.lists.find((list) => list.name === "Listened")?._id;
      if (!listId) return;

      const fetchList = async () => {
        const fetchedList = await getListById(listId);
        if (!fetchedList) return;

        setAlbums(fetchedList.albums);
      };

      fetchList();
    },
    [user],
  );

  const sendAlbum = () => {
    if (!user) return;
    handleSendMessage({
      user,
      socket,
      room,
      message: "",
      type: MessageType.ALBUM,
      album,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"dark"}>
          <AlbumIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Send an Album</h4>
            <p className="text-sm text-muted-foreground">
              Send an album you have listened to!
            </p>
          </div>
          <div className="flex gap-3">
            {albums && <AlbumComboBox albums={albums} setAlbum={setAlbum} />}
            <Button variant={"dark"} onClick={sendAlbum}>
              Send
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
