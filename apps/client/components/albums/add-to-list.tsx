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
  findListsAlbumIsIn,
  getListFromId,
  handleListenedToListenSwitch,
  getLocalDatabaseAlbum,
  deleteAlbumFromList,
} from "@/utils/lists.utils";

// HOOKS.
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/utils/providers/UserProvider";
import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";

// API CALLS.
import { addAlbumToList } from "@/api/list.api";

// UTILS.
import { makeUpdatedAlbumInListUser } from "@/utils/user.utils";

// TYPES.
import { Album, AlbumType } from "@/types";

interface AddToListProps {
  album: Album;
  setAlbums?: (albums: Album[]) => void;
  albums?: Album[];
}

export function AddToList({ album, setAlbums, albums }: AddToListProps) {
  // HOOKS.
  const { toast } = useToast();
  const { user, updateUserInfo } = useUser();
  const lists = useMemo(() => user?.lists || [], [user]);
  const params = useParams();

  // STATES.
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [albumInLists, setAlbumInLists] = React.useState<{
    [key: string]: { isInList: boolean; type: AlbumType };
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
    if (!user) return;

    // IS ALBUM IN LOCAL DATABASE?
    const albumFromLocal = await getLocalDatabaseAlbum(album);
    if (!albumFromLocal?._id) return;

    // GRAB THE FULL LIST.
    const selectedList = getListFromId(lists, listId);
    if (!selectedList?._id) return;

    // GRAB THE SLUG.
    const slug = Array.isArray(params.slug)
      ? params.slug[0]
      : params.slug || "";

    // ARE WE DELETING FROM LIST?
    const checkDeleteAlbumFromList = await deleteAlbumFromList(
      selectedList,
      albumInLists,
      slug,
      album,
      user,
      updateUserInfo,
      albums,
      setAlbums,
    );

    if (checkDeleteAlbumFromList) {
      toast(checkDeleteAlbumFromList);
      return;
    }

    // HANDLE SWITCHING.
    const switchResults = await handleListenedToListenSwitch(
      selectedList,
      albumFromLocal,
      lists,
      albumInLists,
      slug,
      user,
      updateUserInfo,
      albums,
      setAlbums,
    );

    if (switchResults) {
      toast(switchResults);
      return;
    }

    // ADD ALBUM TO DATABASE.
    await addAlbumToList(listId, albumFromLocal._id);

    const updatedUser = makeUpdatedAlbumInListUser(
      user,
      selectedList?._id,
      albumFromLocal._id,
    );

    if (!updatedUser) return;

    updateUserInfo(updatedUser);

    // SEND TOAST.
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
