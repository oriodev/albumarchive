import { Album } from "@/types";
import { AlbumDialogue } from "./album-dialogue";

export function AlbumDisplay({
  albums,
  setAlbums,
  local,
}: {
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
  local: boolean;
}) {
  return (
    <div className="w-full grid grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
      {albums.map((album: Album) => (
        <div key={`${album.title}+${album.artist}+${album.genre}`}>
          <AlbumDialogue
            album={album}
            setAlbums={setAlbums}
            albums={albums}
            layoutType="Grid"
            local={local}
          />
        </div>
      ))}
    </div>
  );
}
