"use client";

import { Album } from "@/types";
import { AddToList } from "../dropdowns/add-to-list-dropdown";
import { AlbumRecDialogue } from "../dialogs/album-rec-dialogue";

interface Props {
  album: Album;
}

export default function AlbumActionButton({ album }: Props) {
  return (
    <div className="flex gap-2">
      <AddToList album={album} />
      <AlbumRecDialogue album={album} />
    </div>
  );
}
