import { Album } from "@/types";
import { AlbumDialogue } from "./album-dialogue";

export function AlbumScrollDisplay({ albums }: { albums: Album[] }) {
  return (
    <div className="overflow-x-auto overflow-y-hidden scrollbar-hidden">
      <div className="flex space-x-4 p-3">
        {albums.map((album: Album) => (
          <div
            className="flex-shrink-0 w-1/5"
            key={`${album.title}+${album.artist}`}
          >
            <AlbumDialogue album={album} layoutType="Grid" local={true} />
          </div>
        ))}
      </div>
    </div>
  );
}
