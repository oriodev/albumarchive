import { Album } from "@/types";
import ListGrid from "./list-grid";
import ListList from "./list-list";

export function ListAlbumDisplay({
  layoutType,
  albums,
  setAlbums,
}: {
  layoutType: string;
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
}) {
  return (
    <div>
      {layoutType === "Grid" ? (
        <ListGrid
          albums={albums}
          setAlbums={setAlbums}
          layoutType={layoutType}
        />
      ) : (
        <ListList
          albums={albums}
          setAlbums={setAlbums}
          layoutType={layoutType}
        />
      )}
    </div>
  );
}
