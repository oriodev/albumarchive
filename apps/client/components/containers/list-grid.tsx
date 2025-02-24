import { Album } from "@/types";
import { AlbumDialogue } from "@/components/dialogs/album-dialogue";

export default function ListGrid({
  albums,
  setAlbums,
  layoutType,
}: {
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
  layoutType: string;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2">
      {albums.map((album: Album) => (
        <div key={`${album.title}+${album.artist}+${album.genre}`}>
          <AlbumDialogue
            album={album}
            setAlbums={setAlbums}
            albums={albums}
            layoutType={layoutType}
            local={true}
          />
        </div>
      ))}

      <div></div>
    </div>
  );
}
