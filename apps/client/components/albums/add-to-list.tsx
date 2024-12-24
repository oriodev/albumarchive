"use client";

import * as React from "react";
import { Check, PlusCircleIcon } from "lucide-react";

import { cn } from "@/lib/utils";
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
import { useUser } from "@/utils/providers/UserProvider";
import { Album } from "@/types";
import { createAlbum, getAlbumByTitle } from "@/api/albums.api";

interface AddToListProps {
  album: Album;
}

export function AddToList({ album }: AddToListProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const user = useUser();
  const lists = user?.lists || [];

  // check if the album is already in each list.
  // if it is then make it so you can't add the album to the list.
  // easier to

  const onAddToList = async (listId: string) => {
    console.log("album being fetched is: ", album.title);

    const localAlbum = await getAlbumByTitle(album.title);

    console.log("result of localAlbum is: ", localAlbum);

    if (!localAlbum) {
      const albumToAdd = {
        title: album.title,
        artist: album.artist,
        genre: album.genre,
        releaseDate: album.releaseDate,
        coverImage: album.coverImage,
        overallRating: 0,
        reviews: [],
      };

      console.log("album to add is: ", albumToAdd);

      const addAlbumToLocal = await createAlbum(albumToAdd);

      if (!addAlbumToLocal) {
        console.log("yeah that didnt work we didnt add album to the local db");
      }
    }

    // addAlbumToList()
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
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === list.name ? "opacity-100" : "opacity-0",
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
