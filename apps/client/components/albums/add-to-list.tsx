"use client";

// REACT.
import * as React from "react";

// COMPONENTS.
import { Check, PlusCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover-dialogue";

// UTILS.
import { cn } from "@/lib/utils";
import {
  addAlbumToLocalDb,
  shouldWeDeleteFromList,
  findListsAlbumIsIn,
  getListFromId,
  removeAlbum,
} from "@/utils/lists.utils";

// HOOKS.
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/utils/providers/UserProvider";
import { useEffect, useMemo } from "react";

// API CALLS.
import { getAlbumByTitle } from "@/api/albums.api";
import { addAlbumToList } from "@/api/list.api";

// TYPES.
import { Album, Type } from "@/types";
import { useParams } from "next/navigation";
import { slugify } from "@/utils/global.utils";

interface AddToListProps {
  album: Album;
  setAlbums: (albums: Album[]) => void;
  albums: Album[];
}

export function AddToList({ album, setAlbums, albums }: AddToListProps) {
  // HOOKS.
  const { toast } = useToast();
  const { user } = useUser();
  const lists = useMemo(() => user?.lists || [], [user]);
  const params = useParams();

  // STATES.
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [albumInLists, setAlbumInLists] = React.useState<{
    [key: string]: { isInList: boolean; type: Type };
  }>({});

  // USE EFFECT.
  useEffect(() => {
    const getAlbumStatusMap = async () => {
      const albumStatusMap = await findListsAlbumIsIn(lists, album);
      setAlbumInLists(albumStatusMap);
    };

    getAlbumStatusMap();
  }, [album, lists]);

  // HANDLE ADDING TO LIST.
  const onAddToList = async (listId: string) => {
    // IS ALBUM IN LOCAL DATABASE?

    const albumInLocal = await getAlbumByTitle(album.title);

    if (!albumInLocal) {
      await addAlbumToLocalDb(album);
    }

    const albumFromLocal = await getAlbumByTitle(album.title);

    if (!albumFromLocal) {
      throw new Error("album is not in local db for some reason");
    }

    // THROW AN ERROR IF THERE'S NO ALBUM ID.

    if (!albumFromLocal._id) {
      toast({
        title: "Album does not exist somehow",
        description: "idk either tbh",
      });
      return;
    }

    // GRAB THE FULL LIST.

    const selectedList = getListFromId(lists, listId);

    if (!selectedList?._id) {
      toast({
        title: "List does not exist somehow",
        description: "idk either tbh",
      });
      return;
    }

    const slug = Array.isArray(params.slug)
      ? params.slug[0]
      : params.slug || "";

    // ARE WE DELETING FROM LIST?

    const isAlbumInList = selectedList?._id in albumInLists;

    if (isAlbumInList) {
      const updateState = slugify(selectedList.name) === slug;

      removeAlbum(
        selectedList?._id,
        albumFromLocal._id,
        albums,
        setAlbums,
        updateState,
      );

      toast({
        title: `Removed ${album.title} from ${selectedList?.name}`,
      });

      return;
    }

    // HANDLING DELETING LIST FROM LISTENED/TO LISTEN.

    const listToDeleteFrom = await shouldWeDeleteFromList(
      selectedList,
      album,
      lists,
      albumInLists,
    );

    if (listToDeleteFrom?.type === "toListen") {
      const updateState = slug === "to-listen";

      removeAlbum(
        listToDeleteFrom.id,
        albumFromLocal._id,
        albums,
        setAlbums,
        updateState,
      );

      toast({
        title: "Moved To Listened",
        description: "Congrats on listening to a new album <3",
      });
    }

    if (listToDeleteFrom?.type === "listened") {
      const updateState = slug === "listened";

      removeAlbum(
        listToDeleteFrom.id,
        albumFromLocal._id,
        albums,
        setAlbums,
        updateState,
      );

      toast({
        title: "Moved To To Listen",
        description: "Guess u didn't listen to that album yet huh",
      });
    }

    // ACTUALLY ADDING THE ALBUM TO THE LIST.

    await addAlbumToList(listId, albumFromLocal._id);

    toast({
      title: `Added ${albumFromLocal.title} to ${selectedList?.name}`,
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {"Add to list"}
          <PlusCircleIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search lists..." />
          <CommandList>
            <CommandEmpty>No list found.</CommandEmpty>
            <CommandGroup>
              {lists.map((list) => (
                <CommandItem
                  key={list.name}
                  value={list._id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    onAddToList(currentValue);
                  }}
                >
                  {/* make this show if album is already in list. */}
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      albumInLists[list._id || ""]
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                  {list.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
