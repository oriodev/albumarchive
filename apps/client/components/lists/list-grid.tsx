import { Album } from "@/types";
import { AlbumDialogue } from "../albums/album-dialogue";

export default function ListGrid({
  albums,
  setAlbums,
}: {
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
      {albums.map((album: Album) => (
        <div key={`${album.title}+${album.artist}+${album.genre}`}>
          <AlbumDialogue album={album} setAlbums={setAlbums} albums={albums} />
        </div>
      ))}

      <div></div>
    </div>
  );
}
