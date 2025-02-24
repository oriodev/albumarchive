import { Album } from "@/types";
import { AlbumDialogue } from "@/components/dialogs/album-dialogue";

export default function ListList({
  albums,
  setAlbums,
  layoutType,
}: {
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
  layoutType: string;
}) {
  return (
    <div className="flex flex-col gap-3">
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
