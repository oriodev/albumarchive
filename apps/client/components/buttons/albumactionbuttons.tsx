"use client";

import { Album } from "@/types";
import { AddToList } from "../dropdowns/add-to-list-dropdown";
import { AlbumRecDialogue } from "../dialogs/album-rec-dialogue";
import Link from "next/link";
import { Button } from "../ui/button";

interface Props {
  album: Album;
}

export default function AlbumActionButton({ album }: Props) {
  return (
    <div className="flex gap-2">
      <AddToList album={album} />
      <AlbumRecDialogue album={album} />
      <Link
        href={`https://www.youtube.com/results?search_query=${album.artist}+${album.title}`}
        target="_blank"
      >
        <Button className="bg-rose-700 hover:bg-rose-800 font-bold text-white">
          YouTube
        </Button>
      </Link>
      <Link
        href={`https://open.spotify.com/search/${album.artist} ${album.title}`}
        target="_blank"
      >
        <Button className="bg-emerald-600 hover:bg-emerald-700 font-bold text-white">
          Spotify
        </Button>
      </Link>
    </div>
  );
}
