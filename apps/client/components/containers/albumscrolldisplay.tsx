"use client";

import { Album } from "@/types";
import { AlbumDialogue } from "../dialogs/album-dialogue";
import { ScrollDisplay } from "../general/scrolldisplay";

interface Props {
  albums: Album[];
}

export default function AlbumScrollDisplay({ albums }: Props) {
  return (
    <ScrollDisplay>
      {albums.map((album: Album) => (
        <div
          className="flex-shrink-0 w-1/5"
          key={`${album.title}+${album.artist}`}
        >
          <AlbumDialogue album={album} layoutType="Grid" local={true} />
        </div>
      ))}
    </ScrollDisplay>
  );
}
