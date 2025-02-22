"use client";

import { Check, ChevronsUpDown } from "lucide-react";

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
} from "@/components/ui/popover";
import { Album } from "@/types";
import { useState } from "react";

interface Props {
  albums: Album[];
  setAlbum: (album: Album) => void;
}

export function AlbumComboBox({ albums, setAlbum }: Props) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? albums.find((album) => album.title === value)?.title
            : "Select album..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search albums..." className="h-9" />
          <CommandList>
            <CommandEmpty>No album found.</CommandEmpty>
            <CommandGroup>
              {albums.map((album) => (
                <CommandItem
                  key={album._id}
                  value={album.title}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setAlbum(album || "");
                    setOpen(false);
                  }}
                >
                  {album.title} ({album.artist})
                  <Check
                    className={cn(
                      "ml-auto",
                      value === album._id ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
